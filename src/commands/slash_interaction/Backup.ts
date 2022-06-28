import Backup from 'discord-backup';
import { ApplicationCommandOptionChoiceData, AutocompleteInteraction, ChatInputCommandInteraction, Client, EmbedBuilder, Guild, InteractionType, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../../structures';

const { ApplicationCommandAutocomplete } = InteractionType;

export default class extends SlashCommand {
  [k: string]: any;

  constructor(client: Client) {
    super(client, {
      category: 'Utility',
      clientPermissions: ['BanMembers', 'ManageChannels', 'ManageEmojisAndStickers', 'ManageGuild', 'ManageMessages', 'ManageRoles', 'ManageWebhooks', 'ReadMessageHistory', 'ViewChannel'],
      userPermissions: ['Administrator'],
    });

    this.data = new SlashCommandBuilder().setName('backup')
      .setDescription('Make backup for your server - Powered by Discord Backup.')
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
      .setNameLocalizations(this.getLocalizations('backupName'))
      .setDescriptionLocalizations(this.getLocalizations('backupDescription'))
      .addSubcommand(subcommand => subcommand.setName('create')
        .setDescription('Create a new backup. Only on server!')
        .setNameLocalizations(this.getLocalizations('backupCreateName'))
        .setDescriptionLocalizations(this.getLocalizations('backupCreateDescription')))
      .addSubcommandGroup(subcommandgroup => subcommandgroup.setName('delete')
        .setDescription('If you are on a server, you will manage server backups.')
        .setNameLocalizations(this.getLocalizations('backupDeleteName'))
        .setDescriptionLocalizations(this.getLocalizations('backupDeleteDescription'))
        .addSubcommand(subcommand => subcommand.setName('server')
          .setDescription('Delete backups from a server.')
          .setNameLocalizations(this.getLocalizations('backupDeleteServerName'))
          .setDescriptionLocalizations(this.getLocalizations('backupDeleteServerDescription'))
          .addStringOption(option => option.setName('id')
            .setDescription('The id of the server to delete.')
            .setNameLocalizations(this.getLocalizations('backupDeleteServerIdName'))
            .setDescriptionLocalizations(this.getLocalizations('backupDeleteServerIdDescription'))
            .setAutocomplete(true)
            .setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName('backup')
          .setDescription('Delete a backup.')
          .setNameLocalizations(this.getLocalizations('backupDeleteBackupName'))
          .setDescriptionLocalizations(this.getLocalizations('backupDeleteBackupDescription'))
          .addStringOption(option => option.setName('key')
            .setDescription('The key of the backup to delete.')
            .setNameLocalizations(this.getLocalizations('backupDeleteBackupKeyName'))
            .setDescriptionLocalizations(this.getLocalizations('backupDeleteBackupKeyDescription'))
            .setAutocomplete(true)
            .setRequired(true))))
      .addSubcommand(subcommand => subcommand.setName('list')
        .setDescription('If you are on a server, this shows the backups for that server.')
        .setNameLocalizations(this.getLocalizations('backupListName'))
        .setDescriptionLocalizations(this.getLocalizations('backupListDescription')))
      .addSubcommandGroup(subcommandgroup => subcommandgroup.setName('restore')
        .setDescription('If you are on a server, you will manage server backups.')
        .setNameLocalizations(this.getLocalizations('backupRestoreName'))
        .setDescriptionLocalizations(this.getLocalizations('backupRestoreDescription'))
        .addSubcommand(subcommand => subcommand.setName('backup')
          .setDescription('Restore a backup.')
          .setNameLocalizations(this.getLocalizations('backupRestoreBackupName'))
          .setDescriptionLocalizations(this.getLocalizations('backupRestoreBackupDescription'))
          .addStringOption(option => option.setName('key')
            .setDescription('The key of the backup to restore.')
            .setNameLocalizations(this.getLocalizations('backupRestoreBackupKeyName'))
            .setDescriptionLocalizations(this.getLocalizations('backupRestoreBackupKeyDescription'))
            .setAutocomplete(true)
            .setRequired(true))
          .addBooleanOption(option => option.setName('clear_server')
            .setDescription('Clear the server before restoring?')
            .setNameLocalizations(this.getLocalizations('backupRestoreBackupClearServerName'))
            .setDescriptionLocalizations(this.getLocalizations('backupRestoreBackupClearServerDescription')))))
      .addSubcommand(subcommand => subcommand.setName('update')
        .setDescription('Update a backup. Only on server!')
        .setNameLocalizations(this.getLocalizations('backupUpdateName'))
        .setDescriptionLocalizations(this.getLocalizations('backupUpdateDescription'))
        .addStringOption(option => option.setName('key')
          .setDescription('The key of the backup to update.')
          .setNameLocalizations(this.getLocalizations('backupUpdateKeyName'))
          .setDescriptionLocalizations(this.getLocalizations('backupUpdateKeyDescription'))
          .setAutocomplete(true)
          .setRequired(true)));
  }

  async execute(interaction: ChatInputCommandInteraction | AutocompleteInteraction): Promise<any> {
    const { locale, memberPermissions, options } = interaction;

    const userPerms = memberPermissions?.missing(this.props!.userPermissions!, true);

    if (userPerms?.length) {
      if (interaction.type === ApplicationCommandAutocomplete) return interaction.respond([]);

      return interaction.reply({
        content: this.t('missingUserPermission', {
          locale,
          permission: this.t(userPerms[0], { locale }),
        }),
        ephemeral: true,
      });
    }

    const subcommand = options.getSubcommandGroup() ?? options.getSubcommand();

    if (interaction.type === ApplicationCommandAutocomplete)
      return this[`${subcommand}Autocomplete`]?.(interaction);

    await interaction.deferReply({ ephemeral: true, fetchReply: true });

    return this[subcommand]?.(interaction);
  }

  async create(interaction: ChatInputCommandInteraction): Promise<any> {
    const { locale } = interaction;

    if (!interaction.inCachedGuild())
      return interaction.editReply(this.t('onlyOnServer', { locale }));

    const { guild, guildId, user } = interaction;

    const clientPerms = guild.members.me?.permissions.missing(this.props!.clientPermissions!);

    if (clientPerms?.length)
      return interaction.editReply(this.t('missingPermission', {
        locale,
        permission: this.t(clientPerms[0], { locale }),
      }));

    const dbUser = await this.prisma.user.findFirst({
      where: { id: guild.ownerId },
      include: {
        guilds: { include: { backups: { where: { userId: guild.ownerId } } } },
        backups: { where: { guildId: guildId, userId: guild.ownerId } },
      },
    });

    const premium = Date.now() < (dbUser?.premium?.valueOf() ?? 0);

    if (!dbUser) {
      const newUser = await this.newUser(guild, { premium });

      if (!newUser) return interaction.editReply(this.t('backupError', { locale }));

      const [newBackup] = newUser.backups;

      return interaction.editReply(`${this.t(['backupDone', 'userKeyIs'], { locale })} \`${newBackup.id}\``);
    }

    const guilds = dbUser.guilds.filter(g => g.backups.length);

    if (dbUser.guilds.every(g => g.id !== guildId) && (premium ? guilds.length < 5 : !guilds.length)) {
      const newGuild = await this.newGuild(guild, { premium });

      if (!newGuild) return interaction.editReply(this.t('backupError', { locale }));

      const [newBackup] = newGuild.backups;

      return interaction.editReply(`${this.t(['backupDone', 'userKeyIs'], { locale })} \`${newBackup.id}\``);
    }

    const { backups } = dbUser;

    if (dbUser.guilds.some(g => g.id === guildId) && (premium ?
      backups.length ? backups.length < 5 : guilds.length < 5 :
      !(backups.length || guilds.length))) {
      const newBackup = await this.newBackup(guild, { premium });

      if (!newBackup) return interaction.editReply(this.t('backupError', { locale }));

      return interaction.editReply(`${this.t(['backupDone', 'userKeyIs'], { locale })} \`${newBackup.id}\``);
    }

    return interaction.editReply([
      user,
      this.t(['alreadyHaveABackup', 'doYouMean??'], { locale, string: 'update' }),
    ].join(' '));
  }

  async delete(interaction: ChatInputCommandInteraction): Promise<any> {
    const { guild, locale, options, user } = interaction;

    const subcommand = options.getSubcommand();

    if (subcommand === 'server') {
      const id = options.getString('id', true);

      const userId = guild?.ownerId ?? user.id;

      const deleted = await this.prisma.backup.deleteMany({
        where: {
          guildId: id,
          userId,
        },
      });

      if (!deleted)
        return interaction.editReply(this.t('server404', { locale }));

      return interaction.editReply(this.t('backupDeleted', { locale }));
    }

    if (subcommand === 'backup') {
      const key = options.getString('key', true);

      const deleted = await this.prisma.backup.delete({ where: { id: key } });

      if (!deleted)
        return interaction.editReply(this.t('backup404', { locale }));

      return interaction.editReply(this.t('backupDeleted', { locale }));
    }
  }

  async list(interaction: ChatInputCommandInteraction): Promise<any> {
    const { guild, guildId, locale, user } = interaction;

    const userId = guild?.ownerId ?? user.id;

    const backups = await this.prisma.backup.findMany({ where: { userId } });

    if (!backups.length)
      return interaction.editReply(this.t('You don\'t have backups in the database', { locale }));

    const embeds = [new EmbedBuilder().setColor('Random')];

    for (let i = 0; i < backups.length; i++) {
      const backup = backups[i];

      if (!backup.data || typeof backup.data !== 'object' || Array.isArray(backup.data)) continue;

      embeds[0].addFields({
        name: [
          backup.data.id,
          ' | ',
          backup.data.name,
        ].join(''),
        value: [
          backup.id,
          backup.data.guildID === guildId ? ` | ${this.t('currentServer', { locale })}` : '',
          backup.premium ? ' - `Premium`' : '',
        ].join(''),
        inline: true,
      });

      if (embeds[0].data.fields?.length === 25) break;
    }

    return interaction.editReply({ embeds });
  }

  async restore(interaction: ChatInputCommandInteraction): Promise<any> {
    const { locale } = interaction;

    if (!interaction.inCachedGuild())
      return interaction.editReply(this.t('onlyOnServer', { locale }));

    const { guild, options } = interaction;

    const clientPerms = guild.members.me?.permissions.missing(this.props!.clientPermissions!);

    if (clientPerms?.length)
      return interaction.editReply(this.t('missingPermission', {
        locale,
        permission: this.t(clientPerms[0], { locale }),
      }));

    const key = options.getString('key', true);

    const backup = await this.prisma.backup.findFirst({ where: { id: key } });

    if (!backup?.data)
      return interaction.editReply(this.t('backup404', { locale }));

    const { data, premium } = backup;

    const clear = options.getBoolean('clear_server') ?? false;

    await interaction.editReply(`${this.t('restoring'), { locale }}...`);

    try {
      await Backup.load(<string>data, <any>guild, {
        clearGuildBeforeRestore: clear,
        maxMessagesPerChannel: premium ? 20 : 0,
      });

      return interaction.editReply('☑️').catch(() => null);
    } catch {
      return interaction.editReply(`${this.t('restoreError', { locale })}`).catch(() => null);
    }
  }

  async update(interaction: ChatInputCommandInteraction): Promise<any> {
    const { locale } = interaction;

    if (!interaction.inCachedGuild())
      return interaction.editReply(this.t('onlyOnServer', { locale }));

    const { guild, options } = interaction;

    const clientPerms = guild.members.me?.permissions.missing(this.props!.clientPermissions!);

    if (clientPerms?.length)
      return interaction.editReply(this.t('missingPermission', {
        locale,
        permission: this.t(clientPerms[0], { locale }),
      }));

    const key = options.getString('key', true);

    const dbUser = await this.prisma.user.findFirst({
      where: { id: guild.ownerId },
      include: { backups: { where: { id: key } } },
    });

    if (!(dbUser?.backups.length))
      return interaction.editReply(this.t('backup404', { locale }));

    const premium = Date.now() < (dbUser.premium?.valueOf() ?? 0);

    const newBackup = await this.updateBackup(guild, key, { premium });

    if (!newBackup) return interaction.editReply(this.t('backupError', { locale }));

    return interaction.editReply(`${this.t(['backupDone', 'userKeyIs'], { locale })} \`${newBackup.id}\``);
  }

  async deleteAutocomplete(interaction: AutocompleteInteraction, res: ApplicationCommandOptionChoiceData[] = []) {
    if (interaction.responded) return;

    const { client, guild, guildId, locale, options, user } = interaction;

    const userId = guild?.ownerId || user.id;

    const focused = options.getFocused(true);

    if (focused.name === 'id') {
      const dbUser = await this.prisma.user.findFirst({
        where: { id: userId },
        include: {
          guilds: {
            where: { backups: { some: { AND: [{ userId, NOT: undefined }] } } },
            include: { backups: { where: { userId } } },
          },
        },
      });

      if (!dbUser?.guilds) return interaction.respond(res);

      for (let i = 0; i < dbUser.guilds.length; i++) {
        const dbGuild = dbUser.guilds[i];

        const guildName = (typeof dbGuild.backups[0].data === 'object' &&
          !Array.isArray(dbGuild.backups[0].data) && dbGuild.backups[0].data?.name) ||
          (await client.guilds.fetch(dbGuild.id))?.name ||
          this.t('undefinedServerName', { locale });

        const name = [
          dbGuild.id,
          ' | ', guildName,
          `${dbGuild.id === guildId ? ` | ${this.t('currentServer', { locale })}` : ''}`,
        ].join('').slice(0, 100);

        res.push({
          name,
          value: `${dbGuild.id}`,
        });

        if (res.length === 25) break;
      }
    }

    if (focused.name === 'key') {
      const backups = await this.prisma.backup.findMany({ where: { userId } });

      for (let i = 0; i < backups.length; i++) {
        const backup = backups[i];

        if (!backup.data || typeof backup.data !== 'object' || Array.isArray(backup.data)) continue;

        const name = [
          backup.id,
          ' | ', backup.data.name,
          backup.premium ? ' | Premium' : '',
          backup.guildId == guildId ? ` | ${this.t('currentServer', { locale })}` : '',
        ].join('').slice(0, 100);

        res.push({
          name,
          value: `${backup.id}`,
        });

        if (res.length === 25) break;
      }
    }

    return interaction.respond(res);
  }

  async restoreAutocomplete(interaction: AutocompleteInteraction, res: ApplicationCommandOptionChoiceData[] = []) {
    if (!interaction.inCachedGuild()) return interaction.respond(res);

    return this.deleteAutocomplete(interaction, res);
  }

  async updateAutocomplete(interaction: AutocompleteInteraction, res: ApplicationCommandOptionChoiceData[] = []) {
    if (interaction.responded) return;

    if (!interaction.inCachedGuild()) return interaction.respond(res);

    const { guild, guildId } = interaction;

    const dbUser = await this.prisma.user.findFirst({
      where: { id: guild.ownerId },
      include: { backups: { where: { guildId } } },
    });

    if (!dbUser) return interaction.respond(res);

    for (let i = 0; i < dbUser.backups.length; i++) {
      const backup = dbUser.backups[i];

      if (!backup.data || typeof backup.data !== 'object' || Array.isArray(backup.data)) continue;

      const name = [
        backup.id,
        ' | ', backup.data.name,
        backup.premium ? ' | Premium' : '',
      ].join('').slice(0, 100);

      res.push({
        name,
        value: `${backup.id}`,
      });

      if (res.length === 25) break;
    }

    return interaction.respond(res);
  }

  async createBackup(guild: Guild, options: { premium: boolean }) {
    const { premium } = options;

    return await Backup.create(<any>guild, {
      jsonBeautify: false,
      jsonSave: false,
      maxMessagesPerChannel: premium ? 20 : 0,
    });
  }

  async newBackup(guild: Guild, options: { premium: boolean }) {
    const { id, ownerId } = guild;

    const { premium } = options;

    const data = await this.createBackup(guild, options) as any;

    try {
      return await this.prisma.backup.create({
        data: { id: data.id, data, guildId: id, premium, userId: ownerId },
      });
    } catch (e) {
      return console.log(e);
    }
  }

  async newGuild(guild: Guild, options: { premium: boolean }) {
    const { id, ownerId } = guild;

    const { premium } = options;

    const data = await this.createBackup(guild, options) as any;

    try {
      return await this.prisma.guild.create({
        data: { id, userId: ownerId, backups: { create: { id: data.id, data, premium, userId: ownerId } } },
        include: { backups: { where: { id: data.id } } },
      });
    } catch (e) {
      return console.log(e);
    }
  }

  async newUser(guild: Guild, options: { premium: boolean }) {
    const { id, ownerId } = guild;

    const { premium } = options;

    const data = await this.createBackup(guild, options) as any;

    try {
      return await this.prisma.user.create({
        data: {
          id: ownerId,
          guilds: { create: { id } },
          backups: { create: { id: data.id, data, guildId: id, premium } },
          premium: new Date(),
        },
        include: { backups: { where: { id: data.id } } },
      });
    } catch (e) {
      return console.log(e);
    }
  }

  async updateBackup(guild: Guild, key: string, options: { premium: boolean }) {
    const { id, ownerId } = guild;

    const { premium } = options;

    const data = await this.createBackup(guild, options) as any;

    try {
      return await this.prisma.backup.update({
        where: { id: key },
        data: { id: data.id, data, guildId: id, premium, userId: ownerId },
      });
    } catch (e) {
      return console.log(e);
    }
  }
}