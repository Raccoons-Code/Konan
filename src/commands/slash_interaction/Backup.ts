import { SlashCommandBuilder } from '@discordjs/builders';
import Backup from 'discord-backup';
import { ApplicationCommandOptionChoice, AutocompleteInteraction, CommandInteraction, Guild, MessageEmbed, PermissionString } from 'discord.js';
import { Client, SlashCommand } from '../../structures';

export default class extends SlashCommand {
  constructor(client: Client) {
    super(client, {
      clientPermissions: ['BAN_MEMBERS', 'MANAGE_CHANNELS', 'MANAGE_EMOJIS_AND_STICKERS', 'MANAGE_GUILD', 'MANAGE_MESSAGES', 'MANAGE_ROLES', 'MANAGE_WEBHOOKS'],
      userPermissions: ['ADMINISTRATOR'],
    });

    this.data = new SlashCommandBuilder().setName('backup')
      .setDescription('Make backup for your server - Powered by Discord Backup.')
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
  }

  async execute(interaction: CommandInteraction | AutocompleteInteraction) {
    const { locale, memberPermissions, options } = interaction;

    const userPermissions = memberPermissions?.missing(this.props?.userPermissions as PermissionString[]) ?? [];

    if (userPermissions.length) {
      if (interaction.isAutocomplete()) return await interaction.respond([]);

      return await interaction.reply({
        content: this.t('missingUserPermission', { locale, PERMISSIONS: userPermissions }),
        ephemeral: true,
      });
    }

    const command = <'update'>options.getSubcommandGroup(false) ?? options.getSubcommand();

    if (interaction.isAutocomplete())
      return await this[`${command}Autocomplete`]?.(interaction);

    await interaction.deferReply({ ephemeral: true, fetchReply: true });

    await this[command]?.(interaction);
  }

  async create(interaction: CommandInteraction): Promise<any> {
    const { locale } = interaction;

    if (!interaction.inCachedGuild())
      return await interaction.editReply(this.t('onlyOnServer', { locale }));

    const { guild, guildId, user } = interaction;

    const dbUser = await this.prisma.user.findFirst({
      where: { id: guild.ownerId },
      include: { guilds: { include: { backups: true } }, backups: { where: { guildId: guildId } } },
    });

    const premium = Date.now() < (dbUser?.premium?.valueOf() ?? 0);

    if (!dbUser) {
      const newbackup = await this.newUser(guild, { premium });

      return await interaction.editReply(`${this.t(['backupDone', 'userKeyIs'], { locale })} \`${newbackup.id}\``);
    }

    const guilds = dbUser.guilds.filter(g => g.backups.length);

    if (dbUser.guilds.every(g => g.id !== guildId) && (!guilds.length || premium && guilds.length < 5)) {
      const newbackup = await this.newGuild(guild, { premium });

      return await interaction.editReply(`${this.t(['backupDone', 'userKeyIs'], { locale })} \`${newbackup.id}\``);
    }

    const { backups } = dbUser;

    if (dbUser.guilds.some(g => g.id === guildId) && premium ?
      backups.length ? backups.length < 5 : guilds.length < 5 :
      !backups.length && !guilds.length) {
      const newbackup = await this.newBackup(guild, { premium });

      return await interaction.editReply(`${this.t(['backupDone', 'userKeyIs'], { locale })} \`${newbackup.id}\``);
    }

    return await interaction.editReply(`${user}, ${this.t('alreadyHaveABackup', { locale })} ${this.t('doYouMean??', { locale, string: 'update' })}`);
  }

  async delete(interaction: CommandInteraction): Promise<any> {
    const { guild, locale, options, user } = interaction;

    const userId = guild?.ownerId ?? user.id;
    const id = options.getString('id')?.split(' |')[0];
    const key = options.getString('key')?.split(' |')[0] || '';

    const dbUser = await this.prisma.user.findFirst({
      where: { id: userId },
      include: {
        guilds: { where: { id } },
        backups: { where: { id: key } },
      },
    });

    if (!dbUser)
      return await interaction.editReply(this.t('information404', { locale }));

    const subcommand = options.getSubcommand();

    if (subcommand === 'server') {
      if (!dbUser.guilds.length)
        return await interaction.editReply(this.t('server404', { locale }));

      await this.prisma.backup.deleteMany({ where: { guildId: id } });

      return await interaction.editReply(this.t('backupDeleted', { locale }));
    }

    if (subcommand === 'backup') {
      if (!dbUser.backups.length)
        return await interaction.editReply(this.t('backup404', { locale }));

      await this.prisma.backup.delete({ where: { id: key } });

      return await interaction.editReply(this.t('backupDeleted', { locale }));
    }
  }

  async list(interaction: CommandInteraction): Promise<any> {
    const { guild, locale, user } = interaction;

    const userId = guild?.ownerId ?? user.id;

    const backups = await this.prisma.backup.findMany({ where: { userId } });

    if (!backups.length)
      return await interaction.editReply(this.t('You don\'t have backups in the database', { locale }));

    const embeds = [new MessageEmbed().setColor('RANDOM')];

    for (let i = 0; i < backups.length; i++) {
      const backup = backups[i];

      if (!backup.data || typeof backup.data !== 'object' || Array.isArray(backup.data)) continue;

      embeds[0].addField(
        [backup.data.id, ' | ', backup.data.name].join(''),
        [backup.id, backup.premium ? ' - `Premium`' : ''].join(''),
      );

      if (embeds[0].fields.length === 25) break;
    }

    await interaction.editReply({ embeds });
  }

  async restore(interaction: CommandInteraction): Promise<any> {
    const { locale } = interaction;

    if (!interaction.inCachedGuild())
      return await interaction.editReply(this.t('onlyOnServer', { locale }));

    const { guild, options } = interaction;

    const key = options.getString('key')?.split(' |')[0];

    const backup = await this.prisma.backup.findFirst({ where: { id: key } });

    if (!backup || !backup.data) return;

    const { data, premium } = backup;

    const clear = <boolean>options.getBoolean('clear_server');

    await interaction.editReply(`${this.t('restoring'), { locale }}...`).catch(() => null);

    try {
      await Backup.load(<string>data, guild, {
        clearGuildBeforeRestore: clear,
        maxMessagesPerChannel: premium ? 20 : 0,
      });

      await interaction.editReply(':heavy_check_mark:⠀').catch(() => null);
    } catch {
      await interaction.editReply(`${this.t('restoreError', { locale })}`).catch(() => null);
    }
  }

  async update(interaction: CommandInteraction): Promise<any> {
    const { locale } = interaction;

    if (!interaction.inCachedGuild())
      return await interaction.editReply(this.t('onlyOnServer', { locale }));

    const { guild, guildId, options } = interaction;

    const key = <string>options.getString('key')?.split(' |')[0];

    const dbUser = await this.prisma.user.findFirst({
      where: { id: guild.ownerId },
      include: { backups: { where: { id: key } }, guilds: { where: { id: <string>guildId } } },
    });

    if (!dbUser || !dbUser.backups.length)
      return await interaction.editReply(this.t('backup404', { locale }));

    const premium = Date.now() < (dbUser.premium?.valueOf() ?? 0);

    const newbackup = await this.updatebackup(guild, key, { premium });

    return await interaction.editReply(`${this.t(['backupDone', 'userKeyIs'], { locale })} \`${newbackup.id}\``);
  }

  async deleteAutocomplete(interaction: AutocompleteInteraction, res: ApplicationCommandOptionChoice[] = []) {
    if (interaction.responded) return;

    const { client, guild, guildId, locale, options, user } = interaction;

    const userId = guild?.ownerId || user.id;

    const focused = options.getFocused(true);

    if (focused.name === 'id') {
      const dbUser = await this.prisma.user.findFirst({
        where: { id: userId },
        include: { guilds: { where: { backups: { some: { NOT: undefined } } }, include: { backups: true } } },
      });

      if (!dbUser || !dbUser.guilds) return await interaction.respond(res);

      for (let i = 0; i < dbUser.guilds.length; i++) {
        const _guild = dbUser.guilds[i];

        const name = (typeof _guild.backups[0].data === 'object' &&
          !Array.isArray(_guild.backups[0].data) && _guild.backups[0].data?.name) ||
          (await client.guilds.fetch(_guild.id)).name ||
          this.t('undefinedServerName', { locale });

        const nameProps = [
          _guild.id,
          ' | ', name,
          `${_guild.id === guildId ? ` | ${this.t('currentServer', { locale })}` : ''}`,
        ];

        res.push({
          name: `${nameProps.join('').match(this.pattern.label)?.[1]}`,
          value: `${_guild.id}`,
        });

        if (i === 24) break;
      }
    }

    if (focused.name === 'key') {
      const id = options.getString('id')?.split(' |')[0];

      const backups = await this.prisma.backup.findMany({ where: { guildId: id } });

      for (let i = 0; i < backups.length; i++) {
        const backup = backups[i];

        if (!backup.data || typeof backup.data !== 'object' || Array.isArray(backup.data)) continue;

        const nameProps = [
          backup.id,
          ' | ', backup.data.name,
          backup.guildId == guildId ? ` | ${this.t('currentServer', { locale })}` : '',
        ];

        res.push({
          name: `${nameProps.join('').match(this.pattern.label)?.[1]}`,
          value: `${backup.id}`,
        });

        if (i === 24) break;
      }
    }

    await interaction.respond(res);
  }

  async restoreAutocomplete(interaction: AutocompleteInteraction, res: ApplicationCommandOptionChoice[] = []) {
    if (interaction.responded) return;

    if (!interaction.inCachedGuild()) return await interaction.respond(res);

    const { client, guild, guildId, locale, options } = interaction;

    const focused = options.getFocused(true);

    if (focused.name === 'id') {
      const dbUser = await this.prisma.user.findFirst({
        where: { id: guild.ownerId },
        include: { guilds: { where: { backups: { some: { NOT: undefined } } }, include: { backups: true } } },
      });

      if (!dbUser || !dbUser.guilds) return await interaction.respond(res);

      for (let i = 0; i < dbUser.guilds.length; i++) {
        const _guild = dbUser.guilds[i];

        const name = (typeof _guild?.backups[0].data === 'object' &&
          !Array.isArray(_guild?.backups[0].data) && _guild?.backups[0].data?.name) ||
          client.guilds.resolve(_guild.id)?.name ||
          this.t('undefinedServerName', { locale });

        const nameProps = [
          _guild.id,
          ' | ', name,
          _guild.id == guildId ? ` | ${this.t('currentServer', { locale })}` : '',
        ];

        res.push({
          name: `${nameProps.join('').match(this.pattern.label)?.[1]}`,
          value: `${_guild.id}`,
        });

        if (i === 24) break;
      }
    }

    if (focused.name === 'key') {
      const id = options.getString('id')?.split(' |')[0] ?? guildId;

      const backups = await this.prisma.backup.findMany({ where: { guildId: <string>id } });

      if (!backups) return;

      for (let i = 0; i < backups.length; i++) {
        const backup = backups[i];

        if (!backup.data || typeof backup.data !== 'object' || Array.isArray(backup.data)) continue;

        const nameProps = [
          backup.id,
          ' | ', backup.data.name,
          backup.premium ? ' | Premium' : '',
          backup.guildId === guildId ? ` | ${this.t('currentServer', { locale })}` : '',
        ];

        res.push({
          name: `${nameProps.join('').match(this.pattern.label)?.[1]}`,
          value: `${backup.id}`,
        });

        if (i === 24) break;
      }
    }

    await interaction.respond(res);
  }

  async updateAutocomplete(interaction: AutocompleteInteraction, res: ApplicationCommandOptionChoice[] = []) {
    if (interaction.responded) return;

    if (!interaction.inCachedGuild()) return await interaction.respond(res);

    const { guild, guildId } = interaction;

    const dbUser = await this.prisma.user.findFirst({
      where: { id: guild.ownerId },
      include: { backups: { where: { guildId } } },
    });

    if (!dbUser) return await interaction.respond(res);

    for (let i = 0; i < dbUser.backups.length; i++) {
      const backup = dbUser.backups[i];

      if (!backup.data || typeof backup.data !== 'object' || Array.isArray(backup.data)) continue;

      const nameProps = [
        backup.id,
        ' | ', backup.data.name,
        backup.premium ? ' | Premium' : '',
      ];

      res.push({
        name: `${nameProps.join('').match(this.pattern.label)?.[1]}`,
        value: `${backup.id}`,
      });

      if (i === 24) break;
    }

    await interaction.respond(res);
  }

  async newBackup(guild: Guild, options: { premium: boolean }) {
    const { id, ownerId } = guild;

    const { premium } = options;

    const data = await Backup.create(guild,
      { jsonBeautify: false, jsonSave: false, maxMessagesPerChannel: premium ? 20 : 0 }) as any;

    const newBackup = await this.prisma.backup.create({
      data: { id: data.id, data, guildId: id, premium, userId: ownerId },
    });

    return newBackup;
  }

  async newGuild(guild: Guild, options: { premium: boolean }) {
    const { id, ownerId } = guild;

    await this.prisma.guild.create({ data: { id, userId: ownerId } });

    return await this.newBackup(guild, options);
  }

  async newUser(guild: Guild, options: { premium: boolean }) {
    const { id, ownerId } = guild;

    await this.prisma.user.create({ data: { id: ownerId, guilds: { create: { id } }, premium: Date() } });

    return await this.newBackup(guild, options);
  }

  async updatebackup(guild: Guild, key: string, options: { premium: boolean }) {
    const { id, ownerId } = guild;

    const { premium } = options;

    const data = await Backup.create(guild, {
      jsonBeautify: false,
      jsonSave: false,
      maxMessagesPerChannel: premium ? 20 : 0,
    }) as any;

    return await this.prisma.backup.update({
      where: { id: key },
      data: { id: data.id, data, guildId: id, premium, userId: ownerId },
    });
  }
}