const { env: { GUILD_ID, TEAM, TEAM_CHANNEL } } = process;
const { SlashCommand } = require('../../classes');
const { MessageEmbed } = require('discord.js');
const Backup = require('discord-backup');

module.exports = class extends SlashCommand {
  constructor(...args) {
    super(...args, {
      clientPermissions: ['BAN_MEMBERS', 'MANAGE_CHANNELS', 'MANAGE_EMOJIS_AND_STICKERS', 'MANAGE_GUILD', 'MANAGE_MESSAGES', 'MANAGE_ROLES', 'MANAGE_WEBHOOKS'],
      userPermissions: ['ADMINISTRATOR'],
    });
    this.data = this.setName('backup')
      .setDescription('Make backup for your server.')
      .addSubcommand(subcommand => subcommand.setName('create')
        .setDescription('Create a new backup. Only on server!'))
      .addSubcommandGroup(subcommandgroup => subcommandgroup.setName('delete')
        .setDescription('If you are on a server, you will manage server backups.')
        .addSubcommand(subcommand => subcommand.setName('server')
          .setDescription('Delete backups from a server')
          .addStringOption(option => option.setName('id')
            .setDescription('Server ID')
            .setAutocomplete(true)
            .setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName('backup')
          .setDescription('Delete backup')
          .addStringOption(option => option.setName('id')
            .setDescription('Server ID')
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('key')
            .setDescription('Backup key')
            .setAutocomplete(true)
            .setRequired(true))))
      .addSubcommand(subcommand => subcommand.setName('list')
        .setDescription('If you are on a server, this shows the backups for that server.'))
      .addSubcommandGroup(subcommandgroup => subcommandgroup.setName('restore')
        .setDescription('If you are on a server, you will manage server backups.')
        .addSubcommand(subcommand => subcommand.setName('server')
          .setDescription('Restore server')
          .addStringOption(option => option.setName('id')
            .setDescription('Server ID')
            .setAutocomplete(true)
            .setRequired(true))
          .addStringOption(option => option.setName('key')
            .setDescription('Backup key')
            .setAutocomplete(true)
            .setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName('backup')
          .setDescription('Restore server')
          .addStringOption(option => option.setName('key')
            .setDescription('Backup key')
            .setAutocomplete(true)
            .setRequired(true))
          .addBooleanOption(option => option.setName('clear_server')
            .setDescription('Clear server before restore?'))))
      .addSubcommand(subcommand => subcommand.setName('update')
        .setDescription('Update a backup of server. Only on server!')
        .addStringOption(option => option.setName('key')
          .setDescription('Backup key')
          .setAutocomplete(true)
          .setRequired(true)));
    this.cache = { user: {}, guild: {}, backup: {} };
  }

  async execute(interaction = this.CommandInteraction) {
    const { locale, memberPermissions, options } = interaction;

    const userPermissions = memberPermissions?.missing(this.props.userPermissions) || [];

    if (userPermissions.length) {
      if (interaction.isAutocomplete()) return interaction.respond([]);

      return interaction.reply({
        content: this.t('missingUserPermission', { locale, PERMISSIONS: userPermissions }),
        ephemeral: true,
      });
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
      return interaction.editReply(this.t('onlyOnServer', { locale }));

    const owner = await this.prisma.user.findFirst({
      where: { id: guild.ownerId },
      include: { guilds: { include: { backups: true } }, backups: { where: { guildId } } },
    });

    const premium = Date.now() < owner?.premium;

    if (!owner) {
      const newbackup = await this.newUser(guild, { premium });

      return interaction.editReply(`${this.t(['backupDone', 'userKeyIs'], { locale })} \`${newbackup.id}\``);
    }

    const guilds = owner.guilds.filter(g => g.backups.length);

    if (owner.guilds.every(g => g.id !== guildId) && (!guilds.length || premium && guilds.length < 5)) {
      const newbackup = await this.newGuild(guild, { premium });

      return interaction.editReply(`${this.t(['backupDone', 'userKeyIs'], { locale })} \`${newbackup.id}\``);
    }

    const { backups } = owner;

    if (owner.guilds.some(g => g.id === guildId) && premium ?
      backups.length ? backups.length < 5 : guilds.length < 5 :
      !backups.length && !guilds.length) {
      const newbackup = await this.newBackup(guild, { premium });

      return interaction.editReply(`${this.t(['backupDone', 'userKeyIs'], { locale })} \`${newbackup.id}\``);
    }

    return interaction.editReply(`${user}, ${this.t('alreadyHaveABackup', { locale })} ${this.t('doYouMean??', { locale, string: 'update' })}`);
  }

  async delete(interaction = this.CommandInteraction) {
    const { guild, locale, options, user } = interaction;

    const userId = guild?.ownerId || user.id;

    const type = options.getSubcommand();
    const id = options.getString('id').split(' |')[0];
    const key = options.getString('key')?.split(' |')[0] || '';

    const _user = await this.prisma.user.findFirst({
      where: { id: userId },
      include: {
        guilds: { where: { id } },
        backups: { where: { id: key } },
      },
    });

    if (!_user)
      return await interaction.editReply(this.t('information404', { locale }));

    if (type === 'server') {
      if (!_user.guilds.length)
        return await interaction.editReply(this.t('server404', { locale }));

      await this.prisma.backup.deleteMany({ where: { guildId: id } });

      return await interaction.editReply(this.t('backupDeleted', { locale }));
    }

    if (type === 'backup') {
      if (!_user.backups.length)
        return await interaction.editReply(this.t('backup404', { locale }));

      await this.prisma.backup.delete({ where: { id: key } });

      return interaction.editReply(this.t('backupDeleted', { locale }));
    }
  }

  async deleteAutocomplete(interaction = this.AutocompleteInteraction, res = []) {
    if (interaction.responded) return;

    const { client, guild, guildId, locale, options, user } = interaction;

    const userId = guild?.ownerId || user.id;

    const focused = options.getFocused(true);
    const subcommand = options.getSubcommand();

    if (focused.name === 'id') {
      this.cache.user[userId] ? null : this.cache.user[userId] = {};

      const { guilds } = this.cache.user[userId] = await this.prisma.user.findFirst({
        where: { id: userId },
        include: { guilds: { where: { backups: { some: { NOT: undefined } } }, include: { backups: true } } },
      });

      for (let i = 0; i < guilds.length; i++) {
        const _guild = guilds[i];

        const name = _guild.backups[0]?.data.name ||
          client.guilds.resolve(_guild.id)?.name ||
          this.t('undefinedServerName', { locale });

        res.push({
          name: `${_guild.id} | ${name}${_guild.id == guildId ? ` | ${this.t('currentServer', { locale })}` : ''}`,
          value: `${_guild.id}`,
        });

        if (i === 24) break;
      }
    }

    if (focused.name === 'key') {
      const id = options.getString('id').split(' |')[0];

      const backups = subcommand === 'server' ?
        this.cache.user[userId].guilds.find(g => g.id === id).backups :
        await this.prisma.backup.findMany({ where: { guildId: id } });

      for (let i = 0; i < backups.length; i++) {
        const backup = backups[i];

        res.push({
          name: `${backup.id} | ${backup.data.name}${backup.guildId == guildId ? ` | ${this.t('currentServer', { locale })}` : ''}`,
          value: `${backup.id}`,
        });

        if (i === 24) break;
      }
    }

    interaction.respond(res);
  }

  async list(interaction = this.CommandInteraction) {
    const { guild, locale, user } = interaction;

    const userId = guild?.ownerId || user.id;

    const backups = await this.prisma.backup.findMany({ where: { userId } });

    if (!backups.length)
      return interaction.editReply(this.t('You don\'t have backups in the database', { locale }));

    const embeds = [new MessageEmbed().setColor('RANDOM')];

    for (let i = 0; i < backups.length; i++) {
      const backup = backups[i];

      embeds[0].addField(`${backup.data.id} | ${backup.data.name}`, `\`${backup.id}\`${backup.premium ? ' - `Premium`' : ''}`);

      if (i === 24) break;
    }

    interaction.editReply({ embeds });
  }

  async restore(interaction = this.CommandInteraction) {
    const { client, guild, locale, options, user } = interaction;

    const userId = guild?.ownerId || user.id;

    const _type = options.getSubcommand();
    const guildId = options.getString('id').split(' |')[0];
    const key = options.getString('key')?.split(' |')[0];

    const backup = await this.prisma.backup.findFirst({ where: { id: key } });

    if (!backup) return;

    const { premium } = backup;

    if (_type === 'server') {
      const _guild_id = GUILD_ID?.split(',')[0];
      const _channel_id = TEAM_CHANNEL;
      const _team_id = TEAM?.split(',')[0];

      if (!_guild_id || !_channel_id || !_team_id)
        return interaction.editReply(this.t('commandOfflineTryLater', { locale }));

      const _guild = await client.guilds.fetch(_guild_id);

      const _channel = await _guild.channels.fetch(_channel_id);

      const _team = await _guild.members.fetch(_team_id);

      if (!_guild || !_channel || !_team)
        return interaction.editReply(this.t('commandOfflineTryLater', { locale }));

      const filter = message => message.channel.id === _channel_id &&
        message.author.id === _team_id &&
        this.util.parseJSON(message.content).userId === userId;

      const collector = _channel.createMessageCollector({ filter, max: 2, time: 10000, errors: ['time'] });

      collector.on('collect', async message => {
        message.delete().catch(() => null);

        const { invite, size } = this.util.parseJSON(message.content);

        if (size) {
          if (size < 10) {
            const params = { guildId, key, userId };

            return message.reply(`${_team} backup restore ${JSON.stringify(params)}`);
          }

          if (size > 9) {
            return interaction.editReply(this.t(['commandTooManyRequests', 'tryAgain1Min'], { locale }));
          }
        }

        await interaction.editReply({ content: `${invite}` });
      });

      collector.on('end', async (message, reason) => {
        if (reason === 'time') {
          collector.stop;
          return interaction.editReply(this.t('commandOfflineTryLater', { locale }));
        }
      });

      return _channel.send(`${_team} backup guilds ${JSON.stringify({ userId })}`);
    }

    if (!interaction.inGuild())
      return interaction.editReply(this.t('onlyOnServer', { locale }));

    const clear = options.getBoolean('clear_server');

    interaction.editReply(`${this.t('restoring'), { locale }}...`).catch(() => null);

    try {
      await Backup.load(backup.data, guild,
        { maxMessagesPerChannel: premium ? 20 : 0, clearGuildBeforeRestore: clear });
      interaction.editReply(':heavy_check_mark:⠀').catch(() => null);
    } catch {
      interaction.editReply(`${this.t('restoreError', { locale })}`).catch(() => null);
    }
  }

  async restoreAutocomplete(interaction = this.AutocompleteInteraction, res = []) {
    if (interaction.responded) return;

    const { client, guild, guildId, locale, options, user } = interaction;

    const userId = guild?.ownerId || user.id;

    const focused = options.getFocused(true);
    const subcommand = options.getSubcommand();

    if (focused.name === 'id') {
      this.cache.user[userId] ? null : this.cache.user[userId] = {};

      const { guilds } = this.cache.user[userId] = await this.prisma.user.findFirst({
        where: { id: userId },
        include: { guilds: { where: { backups: { some: { NOT: undefined } } }, include: { backups: true } } },
      });

      for (let i = 0; i < guilds.length; i++) {
        const _guild = guilds[i];

        const name = _guild.backups[0]?.data.name ||
          client.guilds.resolve(_guild.id)?.name ||
          this.t('undefinedServerName', { locale });

        res.push({
          name: `${_guild.id} | ${name}${_guild.id == guildId ? ` | ${this.t('currentServer', { locale })}` : ''}`,
          value: `${_guild.id}`,
        });

        if (i === 24) break;
      }
    }

    if (focused.name === 'key') {
      const id = options.getString('id')?.split(' |')[0] || guildId;

      const backups = subcommand === 'server' ?
        this.cache.user[userId].guilds.find(g => g.id === id).backups : interaction.inGuild() ?
          await this.prisma.backup.findMany({ where: { guildId: id } }) : interaction.respond([]);

      for (let i = 0; i < backups.length; i++) {
        const backup = backups[i];

        res.push({
          name: `${backup.id} | ${backup.data.name}${backup.premium ? ' | Premium' : ''}${backup.guildId == guildId ? ` | ${this.t('currentServer', { locale })}` : ''}`,
          value: `${backup.id}`,
        });

        if (i === 24) break;
      }
    }

    interaction.respond(res);
  }

  async update(interaction = this.CommandInteraction) {
    const { guild, guildId, locale, options } = interaction;

    if (!interaction.inGuild())
      return interaction.editReply(this.t('onlyOnServer', { locale }));

    const key = options.getString('key').split(' |')[0];

    const owner = this.cache[guild.ownerId] || await this.prisma.user.findFirst({
      where: { id: guild.ownerId },
      include: { backups: { where: { id: key } }, guilds: { where: { id: guildId } } },
    });

    if (!owner || !owner.backups.length)
      return interaction.editReply(this.t('backup404', { locale }));

    const premium = Date.now() < owner.premium;

    const newbackup = await this.updatebackup(guild, key, { premium });

    return interaction.editReply(`${this.t(['backupDone', 'userKeyIs'], { locale })} \`${newbackup.id}\``);
  }

  async updateAutocomplete(interaction = this.AutocompleteInteraction, res = []) {
    if (interaction.responded) return;

    if (!interaction.inGuild()) return interaction.respond([]);

    const { guild, guildId } = interaction;

    this.cache.user[guild.ownerId] ? null : this.cache.user[guild.ownerId] = {};

    const { backups } = this.cache[guild.ownerId] =
      await this.prisma.user.findFirst({ where: { id: guild.ownerId }, include: { backups: { where: { guildId } } } });

    for (let i = 0; i < backups.length; i++) {
      const backup = backups[i];

      res.push({
        name: `${backup.id} | ${backup.data.name}${backup.premium ? ' | Premium' : ''}`,
        value: `${backup.id}`,
      });

      if (i === 24) break;
    }

    interaction.respond(res);
  }

  async newBackup(guild = this.Guild, options) {
    const { id, ownerId } = guild;

    const { premium } = options;

    const data = await Backup.create(guild,
      { jsonBeautify: false, jsonSave: false, maxMessagesPerChannel: premium ? 20 : 0 });

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

    const data = await Backup.create(guild,
      { jsonBeautify: false, jsonSave: false, maxMessagesPerChannel: premium ? 20 : 0 });

    return await this.prisma.backup.update({
      where: { id: key },
      data: { id: `${Date.now()}`, data, guildId: id, premium, userId: ownerId },
    });
  }
};