const { SlashCommand } = require('../../classes');
const { MessageEmbed } = require('discord.js');
const { backup, restore } = require('../../BackupAPI');

module.exports = class extends SlashCommand {
  constructor(...args) {
    super(...args);
    this.data = this.setName('backup')
      .setDescription('Make backup for your server.')
      .addSubcommand(subcommand => subcommand.setName('create')
        .setDescription('Create a new backup.'))
      .addSubcommandGroup(subcommandgroup => subcommandgroup.setName('delete')
        .setDescription('Delete your backup or server')
        .addSubcommand(subcommand => subcommand.setName('server')
          .setDescription('Delete server')
          .addStringOption(option => option.setName('id')
            .setDescription('Server id')
            .setAutocomplete(true)
            .setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName('backup')
          .setDescription('Delete backup')
          .addStringOption(option => option.setName('id')
            .setDescription('Server id')
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('key')
            .setDescription('backup key')
            .setAutocomplete(true)
            .setRequired(true))))
      .addSubcommand(subcommand => subcommand.setName('list')
        .setDescription('List your backups.'))
      .addSubcommandGroup(subcommandgroup => subcommandgroup.setName('restore')
        .setDescription('restore')
        .addSubcommand(subcommand => subcommand.setName('server')
          .setDescription('restore server')
          .addStringOption(option => option.setName('id')
            .setDescription('Server id')
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('key')
            .setDescription('backup key')
            .setAutocomplete(true)
            .setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName('backup')
          .setDescription('restore server')
          .addStringOption(option => option.setName('key')
            .setDescription('backup key')
            .setAutocomplete(true)
            .setRequired(true))))
      .addSubcommand(subcommand => subcommand.setName('update')
        .setDescription('Update a backup of server.')
        .addStringOption(option => option.setName('key')
          .setDescription('backup key')
          .setAutocomplete(true)
          .setRequired(true)));
    this.cache = { user: {}, guild: {}, backup: {} };
  }

  async execute(interaction = this.CommandInteraction) {
    const { memberPermissions, options } = interaction;

    if (!memberPermissions.has('ADMINISTRATOR')) {
      if (interaction.isAutocomplete()) return interaction.respond([]);

      return interaction.reply({ content: 'You are not allowed to run this command.', ephemeral: true });
    }

    const command = options.getSubcommandGroup(false) || options.getSubcommand();

    if (interaction.isAutocomplete())
      return this[`${command}Autocomplete`]?.(interaction);

    await interaction.deferReply({ ephemeral: true, fetchReply: true });

    this[command]?.(interaction);
  }

  async create(interaction = this.CommandInteraction) {
    const { guild, guildId, locale, user } = interaction;

    if (!interaction.inGuild())
      return interaction.editReply(this.t('Error! This command can only be used on one server.', { locale }));

    const { ownerId } = guild;

    if (user.id != ownerId)
      return interaction.editReply(this.t('You are not the owner of the server.', { locale }));

    const owner = await this.prisma.user.findFirst({
      where: { id: ownerId },
      include: { guilds: { include: { backups: true } }, backups: { where: { guildId } } },
    });

    const premium = Date.now() < owner?.premium;

    if (!owner) {
      const newbackup = await this.newUser(guild, { premium });

      return interaction.editReply(`backup successfully done. Your key is: \`${newbackup.id}\``);
    }

    const guilds = owner.guilds.filter(g => g.backups.length);

    if (owner.guilds.every(g => g.id !== guildId) && (!guilds.length || premium && guilds.length < 5)) {
      const newbackup = await this.newGuild(guild, { premium });

      return interaction.editReply(`backup successfully done. Your key is: \`${newbackup.id}\``);
    }

    const { backups } = owner;

    if (owner.guilds.some(g => g.id === guildId) && premium ?
      backups.length ? backups.length < 5 : guilds.length < 5 :
      !backups.length && !guilds.length) {
      const newbackup = await this.newBackup(guild, { premium });

      return interaction.editReply(`backup successfully done. Your key is: \`${newbackup.id}\``);
    }

    return interaction.editReply(`${user}, ${this.t('you already have a backup.', { locale })}`);
  }

  async delete(interaction = this.CommandInteraction) {
    const { locale, options, user } = interaction;

    const type = options.getSubcommand();
    const id = options.getString('id');
    const key = options.getString('key') || '';

    const _user = await this.prisma.user.findFirst({
      where: { id: user.id },
      include: {
        guilds: { where: { id } },
        backups: { where: { id: key } },
      },
    });

    if (!_user)
      return await interaction.editReply(this.t('Could not find this information.', { locale }));

    if (type === 'server') {
      if (!_user.guilds.length)
        return await interaction.editReply(this.t('Could not find this server.', { locale }));

      await this.prisma.backup.deleteMany({ where: { guildId: id } });

      return await interaction.editReply(this.t('Server backup successfully deleted.', { locale }));
    }

    if (type === 'backup') {
      if (!_user.backups.length)
        return await interaction.editReply(this.t('Could not find this backup.', { locale }));

      await this.prisma.backup.delete({ where: { id: key } });

      return interaction.editReply(this.t('backup successfully deleted.', { locale }));
    }
  }

  async deleteAutocomplete(interaction = this.AutocompleteInteraction) {
    if (interaction.responded) return;

    const { client, guildId, locale, options, user } = interaction;

    const focused = options.getFocused(true);
    const subcommand = options.getSubcommand();

    const res = [];

    if (focused.name === 'id') {
      this.cache.user[user.id] ? null : this.cache.user[user.id] = {};

      const { guilds } = this.cache.user[user.id] = await this.prisma.user.findFirst({
        where: { id: user.id },
        include: { guilds: { where: { backups: { some: { NOT: undefined } } }, include: { backups: true } } },
      });

      for (let i = 0; i < guilds.length; i++) {
        const _guild = guilds[i];

        const name = _guild.backups[0]?.data.name ||
          client.guilds.resolve(_guild.id)?.name ||
          this.t('Undefined server name', { locale });

        res.push({
          name: `${name} | ${_guild.id}${_guild.id == guildId ? ` | ${this.t('Current server', { locale })}` : ''}`,
          value: `${_guild.id}`,
        });

        if (i === 24) break;
      }
    }

    if (focused.name === 'key') {
      const id = options.getString('id');

      const backups = subcommand === 'server' ?
        this.cache.user[user.id].guilds.find(g => g.id === id).backups :
        await this.prisma.backup.findMany({ where: { guildId: id } });

      for (let i = 0; i < backups.length; i++) {
        const _backup = backups[i];

        res.push({
          name: `${_backup.data.name} | ${_backup.id}${_backup.guild == guildId ? ` | ${this.t('Current server', { locale })}` : ''}`,
          value: `${_backup.id}`,
        });

        if (i === 24) break;
      }
    }

    interaction.respond(res);
  }

  async list(interaction = this.CommandInteraction) {
    const { locale, user } = interaction;

    const backups = await this.prisma.backup.findMany({ where: { userId: user.id } });

    if (!backups.length)
      return interaction.editReply(this.t('You don\'t have backups in the database', { locale }));

    const embeds = [new MessageEmbed().setColor('RANDOM')];

    backups.forEach(_backup => {
      embeds[0].addField(`Server: ${_backup.data.name} | ${_backup.data.id}`, `Key: \`${_backup.id}\``);
    });

    interaction.editReply({ embeds });
  }

  async restore(interaction = this.CommandInteraction) {
    const { client, guild, locale, options, user } = interaction;

    const _type = options.getSubcommand();
    const guild_id = options.getString('id');
    const key = options.getString('key');

    const _backup = await this.prisma.backup.findFirst({ where: { id: key } });

    if (!_backup) return;

    if (_type === 'server') {
      const _guild_id = process.env.GUILD_ID?.split(',')[0];
      const _channel_id = process.env.TEAM_CHANNEL;
      const _team_id = process.env.TEAM?.split(',')[0];

      if (!_guild_id || !_channel_id || !_team_id)
        return interaction.editReply(this.t('This command is currently offline, please try again later.',
          { locale }));

      const _guild = client.guilds.resolve(_guild_id) ||
        await client.guilds.fetch(_guild_id);

      const _channel = _guild.channels.resolve(_channel_id) ||
        await client.channels.fetch(_channel_id);

      const _team = _guild.members.resolve(_team_id) ||
        await _guild.members.fetch(_team_id);

      if (!_guild || !_channel || !_team)
        return interaction.editReply(this.t('This command is currently offline, please try again later.',
          { locale }));

      const filter = message => message.channel.id === _channel_id && message.author.id === _team_id;

      const collector = _channel.createMessageCollector({ filter, max: 2, time: 10000, errors: ['time'] });

      collector.on('collect', async message => {
        message.delete().catch(() => null);

        if (parseInt(message.content) < 10) {
          return message.reply(`${_team} backup restore ${guild_id} ${key} ${user.id}`);
        }

        if (parseInt(message.content) > 9) {
          return interaction.editReply(this.t('There are too many requests for this command at the moment. Please try again in 1 minute.', { locale }));
        }

        await interaction.editReply({ content: `${message.content}` });
      });

      collector.on('end', async (message, reason) => {
        if (reason === 'time') {
          collector.stop;
          return interaction.editReply(this.t('This command is currently offline, please try again later.', { locale }));
        }
      });

      return _channel.send(`${_team} backup guilds`);
    }

    if (guild.ownerId !== user.id)
      return interaction.editReply(this.t('You are not the owner of the server.', { locale }));

    const { afkChannelId, afkTimeout, channels, defaultMessageNotifications, explicitContentFilter, icon, roles, systemChannelFlags, systemChannelId, verificationLevel } = restore.create(_backup);

    guild.edit({ afkChannel: afkChannelId, afkTimeout, defaultMessageNotifications, explicitContentFilter, icon, systemChannelFlags, systemChannel: systemChannelId, verificationLevel });

    roles.forEach(role => {
      const id = role.id;

      delete role.id;

      if (guild.roles.resolveId(id))
        return guild.roles.edit(id, role);

      guild.roles.create(role);
    });

    channels.forEach(channel => {
      const { bitrate, id, name, nsfw, parentId, permissionOverwrites, rateLimitPerUser, rtcRegion, topic, type, userLimit } = channel;

      delete channel.id;
      delete channel.name;

      const _channel = guild.channels.resolve(id);

      if (!_channel)
        return guild.channels.create(`${name}`,
          { bitrate, nsfw, parent: parentId, permissionOverwrites, rateLimitPerUser, rtcRegion, topic, type, userLimit });

      _channel.edit({ bitrate, name, nsfw, parent: parentId, permissionOverwrites, rateLimitPerUser, rtcRegion, topic, type, userLimit });
    });
  }

  async restoreAutocomplete(interaction = this.AutocompleteInteraction) {
    if (interaction.responded) return;

    const { client, guildId, locale, options, user } = interaction;

    const focused = options.getFocused(true);
    const subcommand = options.getSubcommand();

    const res = [];

    if (focused.name === 'id') {
      this.cache.user[user.id] ? null : this.cache.user[user.id] = {};

      const { guilds } = this.cache.user[user.id] = await this.prisma.user.findFirst({
        where: { id: user.id },
        include: { guilds: { where: { backups: { some: { NOT: undefined } } }, include: { backups: true } } },
      });

      for (let i = 0; i < guilds.length; i++) {
        const _guild = guilds[i];

        const name = _guild.backups[0]?.data.name ||
          client.guilds.resolve(_guild.id)?.name ||
          this.t('Undefined server name', { locale });

        res.push({
          name: `${name} | ${_guild.id}${_guild.id == guildId ? ` | ${this.t('Current server', { locale })}` : ''}`,
          value: `${_guild.id}`,
        });

        if (i === 24) break;
      }
    }

    if (focused.name === 'key') {
      const id = options.getString('id');

      const backups = subcommand === 'server' ?
        this.cache.user[user.id].guilds.find(g => g.id === id).backups :
        await this.prisma.backup.findMany({ where: { guildId: id } });

      for (let i = 0; i < backups.length; i++) {
        const _backup = backups[i];

        res.push({
          name: `${_backup.data.name} | ${_backup.id}${_backup.premium ? ' | Premium' : ''}${_backup.guildId == guildId ? ` | ${this.t('Current server', { locale })}` : ''}`,
          value: `${_backup.id}`,
        });

        if (i === 24) break;
      }
    }

    interaction.respond(res);
  }

  async update(interaction = this.CommandInteraction) {
    const { guild, locale, options, user } = interaction;

    if (!interaction.inGuild())
      return interaction.editReply(this.t('Error! This command can only be used on one server.', { locale }));

    if (user.id !== guild.ownerId)
      return interaction.editReply(this.t('You are not the owner of the server.', { locale }));

    const key = options.getString('key');

    const owner = this.cache[user.id] || await this.prisma.user.findFirst({
      where: { id: guild.ownerId },
      include: { backups: { where: { id: key } }, guilds: { where: { id: guild.id } } },
    });

    if (!owner || !owner.backups.length)
      return interaction.editReply(this.t('Could not find this backup.', { locale }));

    const premium = Date.now() < owner.premium;

    const newbackup = await this.updatebackup(guild, key, { premium });

    return interaction.editReply(`${this.t('backup successfully done. Your key is:', { locale })} \`${newbackup.id}\``);
  }

  async updateAutocomplete(interaction = this.AutocompleteInteraction) {
    if (interaction.responded) return;

    const { guildId, user } = interaction;

    const res = [];

    this.cache.user[user.id] ? null : this.cache.user[user.id] = {};

    const { backups } = this.cache[user.id] =
      await this.prisma.user.findFirst({ where: { id: user.id }, include: { backups: { where: { guildId } } } });

    for (let i = 0; i < backups.length; i++) {
      const _backup = backups[i];

      res.push({
        name: `${_backup.data.name} | ${_backup.id}${_backup.premium ? ' | Premium' : ''}`,
        value: `${_backup.id}`,
      });

      if (i === 24) break;
    }

    interaction.respond(res);
  }

  async newBackup(guild = this.Guild, options) {
    const { id, ownerId } = guild;

    const { premium } = options;

    const data = await backup.create(guild, options);

    const key = `${Date.now()}`;

    const newBackup = await this.prisma.backup.create({
      data: { id: `${key}`, data, guildId: id, premium, userId: ownerId },
    });

    return newBackup;
  }

  async newGuild(guild = this.Guild, options) {
    const { id, ownerId } = guild;

    await this.prisma.guild.create({ data: { id, userId: ownerId } });

    return await this.newBackup(guild, options);
  }

  async newUser(guild = this.Guild, options) {
    const { id, ownerId } = guild;

    await this.prisma.user.create({ data: { id: ownerId, guilds: { create: { id } } } })
      .catch(console.error);

    return await this.newBackup(guild, options);
  }

  async updatebackup(guild = this.Guild, key, options) {
    const { id, ownerId } = guild;

    const { premium } = options;

    const data = await backup.create(guild, options);

    return await this.prisma.backup.update({
      where: { id: key },
      data: { id: `${Date.now()}`, data, guildId: id, premium, userId: ownerId },
    });
  }
};