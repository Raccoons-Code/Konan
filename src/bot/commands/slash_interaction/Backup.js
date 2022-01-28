const { SlashCommandBuilder } = require('@discordjs/builders');
const { AutocompleteInteraction, CommandInteraction, MessageEmbed } = require('discord.js');
const { backup, restore } = require('../../BackupAPI');
const { prisma } = require('../../database');

module.exports = class extends SlashCommandBuilder {
  constructor(client) {
    super();
    this.client = client;
    this.prisma = prisma;
    this.t = client.t;
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
  }

  /** @param {CommandInteraction} interaction */
  async execute(interaction) {
    this.interaction = interaction;

    const { options } = interaction;

    const command = options.getSubcommandGroup(false) || options.getSubcommand(false);

    if (interaction.isAutocomplete())
      return this[`${command}Autocomplete`]?.();

    this.embeds = [new MessageEmbed().setColor('RANDOM')];

    await interaction.deferReply({ ephemeral: true, fetchReply: true });

    this[command]?.();
  }

  async create(interaction = this.interaction) {
    const { guild, guildId, locale, user } = interaction;

    if (!interaction.inGuild())
      return interaction.editReply(this.t('Error! This command can only be used on one server.', { locale }));

    const { ownerId } = guild;

    if (user.id != ownerId)
      return interaction.editReply(this.t('You are not the owner of the server.', { locale }));

    const owner = await this.prisma.user.findFirst({
      where: { id: ownerId },
      include: { guilds: { where: { userId: ownerId } }, backups: { where: { guildId } } },
    });

    if (!owner) {
      const newbackup = await this.newUser(guild);

      return interaction.editReply(`backup successfully done. Your key is: \`${newbackup.id}\``);
    }

    if (!owner.guilds.length) {
      const newbackup = await this.newGuild(guild);

      return interaction.editReply(`backup successfully done. Your key is: \`${newbackup.id}\``);
    }

    if (!owner.backups.length) {
      const newbackup = await this.newbackup(guild);

      return interaction.editReply(`backup successfully done. Your key is: \`${newbackup.id}\``);
    }

    return interaction.editReply(`${user}, ${this.t('you already have a backup.', { locale })}`);
  }

  async delete(interaction = this.interaction) {
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

      await this.prisma.guild.delete({ where: { id } });

      return await interaction.editReply(this.t('Server backup successfully deleted.', { locale }));
    }

    if (type === 'backup') {
      if (!_user.backups.length)
        return await interaction.editReply(this.t('Could not find this backup.', { locale }));

      await this.prisma.backup.delete({ where: { id: key } });

      return interaction.editReply(this.t('backup successfully deleted.', { locale }));
    }
  }

  /** @param {AutocompleteInteraction} interaction */
  async deleteAutocomplete(interaction = this.interaction) {
    if (interaction.responded) return;

    const { client, guildId, locale, options, user } = interaction;

    const res = [];

    if (options.getFocused(true).name === 'id') {
      const guilds = await this.prisma.guild.findMany({ where: { userId: user.id } });

      guilds?.forEach(_guild => {
        res.push({
          name: `${client.guilds.cache.get(_guild.id)?.name || this.t('Undefined server', { locale })} | ${_guild.id}`,
          value: `${_guild.id}`,
        });
      });
    }

    if (options.getFocused(true).name === 'key') {
      const id = options.getString('id');

      const backups = await this.prisma.backup.findMany({ where: { guildId: id } });

      backups?.forEach(_backup => res.push({
        name: `${_backup.data.name} | ${_backup.id}${_backup.guild == guildId ? ` | ${this.t('Current server', { locale })}` : ''}`,
        value: `${_backup.id}`,
      }));
    }

    interaction.respond(res);
  }

  async list(interaction = this.interaction) {
    const { locale, user } = interaction;

    const backups = await this.prisma.backup.findMany({ where: { userId: user.id } });

    if (!backups.length)
      return interaction.editReply(this.t('You don\'t have backups in the database', { locale }));

    backups.forEach(_backup => {
      this.embeds[0].addField(`Server: ${_backup.data.name} | ${_backup.data.id}`, `Key: \`${_backup.id}\``);
    });

    interaction.editReply({ embeds: [...this.embeds] });
  }

  async restore(interaction = this.interaction) {
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
        return interaction.editReply(this.t('This command is currently offline, please try again later.', { locale }));

      const _guild = client.guilds.resolve(_guild_id) ||
        client.guilds.cache.get(_guild_id) ||
        await client.guilds.fetch(_guild_id);

      const _channel = _guild.channels.resolve(_channel_id) ||
        _guild.channels.cache.get(_channel_id) ||
        await client.channels.fetch(_channel_id);

      const _team = _guild.members.resolve(_team_id) ||
        _guild.members.cache.get(_team_id) ||
        await _guild.members.fetch(_team_id);

      if (!_guild || !_channel || !_team)
        return interaction.editReply(this.t('This command is currently offline, please try again later.', { locale }));

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

      return _channel.send(`${_team} backup guilds`).then(msg => msg.delete());
    }

    if (guild.ownerId !== user.id)
      return interaction.editReply(this.t('You are not the owner of the server.', { locale }));

    const { afkChannelId,
      afkTimeout,
      channels,
      defaultMessageNotifications,
      explicitContentFilter,
      icon,
      roles,
      systemChannelFlags,
      systemChannelId,
      verificationLevel } = restore.create(_backup.data);

    guild.edit({
      afkChannel: afkChannelId,
      afkTimeout,
      defaultMessageNotifications,
      explicitContentFilter,
      icon,
      systemChannelFlags,
      systemChannel: systemChannelId,
      verificationLevel,
    });

    roles.forEach(role => {
      const id = role.id;

      delete role.id;

      if (guild.roles.resolveId(id))
        return guild.roles.edit(id, role);

      guild.roles.create(role);
    });

    channels.forEach(channel => {
      const { bitrate,
        id,
        name,
        nsfw,
        parentId,
        permissionOverwrites,
        rateLimitPerUser,
        rtcRegion,
        topic,
        type,
        userLimit } = channel;

      delete channel.id;
      delete channel.name;

      const _channel = guild.channels.resolve(id);

      if (!_channel) return guild.channels.create(`${name}`, {
        bitrate,
        nsfw,
        parent: parentId,
        permissionOverwrites,
        rateLimitPerUser,
        rtcRegion,
        topic,
        type,
        userLimit,
      });

      _channel.edit({
        bitrate,
        name,
        nsfw,
        parent: parentId,
        permissionOverwrites,
        rateLimitPerUser,
        rtcRegion,
        topic,
        type,
        userLimit,
      });
    });
  }

  /** @param {AutocompleteInteraction} interaction */
  async restoreAutocomplete(interaction = this.interaction) {
    if (interaction.responded) return;

    const { client, guildId, locale, options, user } = interaction;

    const res = [];

    if (options.getFocused(true).name === 'id') {
      const guilds = await this.prisma.guild.findMany({ where: { userId: user.id } });

      guilds?.forEach(_guild => {
        res.push({
          name: `${client.guilds.cache.get(_guild.id)?.name || this.t('Undefined server', { locale })} | ${_guild.id}${_guild.id == guildId ? ` | ${this.t('Current server', { locale })}` : ''}`,
          value: `${_guild.id}`,
        });
      });
    }

    if (options.getFocused(true).name === 'key') {
      const id = options.getString('id');

      const backups = [];

      if (options.getSubcommand() === 'server') {
        const _backups = await this.prisma.backup.findMany({ where: { guildId: id } });
        backups.push(..._backups);
      }

      if (options.getSubcommand() === 'backup') {
        const _backups = await this.prisma.backup.findMany({ where: { userId: user.id } });
        backups.push(..._backups);
      }

      backups.forEach(_backup => res.push({
        name: `${_backup.data.name} | ${_backup.id}${_backup.guild == guildId ?
          ` | ${this.t('Current server', { locale })}` : ''}`,
        value: `${_backup.id}`,
      }));
    }

    interaction.respond(res);
  }

  async update(interaction = this.interaction) {
    const { guild, locale, options, user } = interaction;

    if (!interaction.inGuild())
      return interaction.editReply(this.t('Error! This command can only be used on one server.', { locale }));

    if (user.id !== guild.ownerId)
      return interaction.editReply(this.t('You are not the owner of the server.', { locale }));

    const key = options.getString('key');

    const _user = await this.prisma.user.findFirst({
      where: { id: guild.ownerId },
      include: { backups: { where: { id: key } }, guilds: { where: { id: guild.id } } },
    });

    if (!_user || !_user.backups.length)
      return interaction.editReply(this.t('Could not find this backup.', { locale }));

    const newbackup = await this.updatebackup(guild, key);

    return interaction.editReply(`${this.t('backup successfully done. Your key is:', { locale })} \`${newbackup.id}\``);
  }

  /** @param {AutocompleteInteraction} interaction */
  async updateAutocomplete(interaction = this.interaction) {
    if (interaction.responded) return;

    const { guildId } = interaction;

    const res = [];

    const backups = await this.prisma.backup.findMany({ where: { guildId } });

    backups?.forEach(_backup => res.push({
      name: `${_backup.data.name} | ${_backup.id}`,
      value: `${_backup.id}`,
    }));

    interaction.respond(res);
  }

  async newbackup(guild = this.interaction.guild) {
    const { id, ownerId } = guild;

    const data = backup.create(guild);

    return await this.prisma.backup.create({ data: { id: `${Date.now()}`, data, guildId: id, userId: ownerId } });
  }

  async newGuild(guild = this.interaction.guild) {
    const { id, ownerId } = guild;

    await this.prisma.guild.create({ data: { id, userId: ownerId } });

    return await this.newbackup(guild);
  }

  async newUser(guild = this.interaction.guild) {
    const { ownerId } = guild;

    await this.prisma.user.create({ data: { id: ownerId, oldGuild: null, newGuild: null } }).catch(console.error);

    return await this.newGuild(guild);
  }

  async updatebackup(guild = this.interaction.guild, key) {
    const { id, ownerId } = guild;

    const data = backup.create(guild);

    return await this.prisma.backup.update({ where: { id: key }, data: { id: `${Date.now()}`, data, guildId: id, userId: ownerId } });
  }
};