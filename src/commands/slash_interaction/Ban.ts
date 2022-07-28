import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../../structures';

export default class Ban extends SlashCommand {
  [x: string]: any;

  constructor() {
    super({
      category: 'Moderation',
      appPermissions: ['BanMembers'],
      userPermissions: ['BanMembers'],
    });

    this.data = new SlashCommandBuilder().setName('ban')
      .setDescription('Bans a user from the server.')
      .setDMPermission(false)
      .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
      .setNameLocalizations(this.getLocalizations('banName'))
      .setDescriptionLocalizations(this.getLocalizations('banDescription'))
      .addSubcommand(subcommand => subcommand.setName('single')
        .setDescription('Bans a user.')
        .setNameLocalizations(this.getLocalizations('banSingleName'))
        .setDescriptionLocalizations(this.getLocalizations('banSingleDescription'))
        .addUserOption(option => option.setName('user')
          .setDescription('Select a user to ban.')
          .setNameLocalizations(this.getLocalizations('banSingleUserName'))
          .setDescriptionLocalizations(this.getLocalizations('banSingleUserDescription'))
          .setRequired(true))
        .addIntegerOption(option => option.setName('delete_messages')
          .setDescription('How much of that person\'s message history should be deleted.')
          .setNameLocalizations(this.getLocalizations('banSingleDeleteMessagesName'))
          .setDescriptionLocalizations(this.getLocalizations('banSingleDeleteMessagesDescription'))
          .setChoices({
            name: 'Last 24 hours',
            value: 1,
            name_localizations: this.getLocalizations('lastNHours', { n: 24 }),
          }, {
            name: 'Last 7 days',
            value: 7,
            name_localizations: this.getLocalizations('lastNDays', { n: 7 }),
          }))
        .addStringOption(option => option.setName('reason')
          .setDescription('The reason for the ban.')
          .setNameLocalizations(this.getLocalizations('banSingleReasonName'))
          .setDescriptionLocalizations(this.getLocalizations('banSingleReasonDescription'))))
      .addSubcommand(subcommand => subcommand.setName('chunk')
        .setDescription('Bans a chunk of users from the server.')
        .setNameLocalizations(this.getLocalizations('banChunkName'))
        .setDescriptionLocalizations(this.getLocalizations('banChunkDescription'))
        .addStringOption(option => option.setName('users')
          .setDescription('Input a chunk of users to ban.')
          .setNameLocalizations(this.getLocalizations('banChunkUsersName'))
          .setDescriptionLocalizations(this.getLocalizations('banChunkUsersDescription'))
          .setRequired(true))
        .addIntegerOption(option => option.setName('delete_messages')
          .setDescription('How much of that person\'s message history should be deleted.')
          .setNameLocalizations(this.getLocalizations('banChunkDeleteMessagesName'))
          .setDescriptionLocalizations(this.getLocalizations('banChunkDeleteMessagesDescription'))
          .setChoices({
            name: 'Last 24 hours',
            value: 1,
            name_localizations: this.getLocalizations('lastNHours', { n: 24 }),
          }, {
            name: 'Last 7 days',
            value: 7,
            name_localizations: this.getLocalizations('lastNDays', { n: 7 }),
          }))
        .addStringOption(option => option.setName('reason')
          .setDescription('The reason for the ban.')
          .setNameLocalizations(this.getLocalizations('banChunkReasonName'))
          .setDescriptionLocalizations(this.getLocalizations('banChunkReasonDescription'))));
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<any> {
    await interaction.deferReply({ ephemeral: true });

    if (!interaction.inCachedGuild())
      return this.replyOnlyOnServer(interaction);

    const { appPermissions, memberPermissions, options } = interaction;

    const userPerms = memberPermissions.missing(this.props!.userPermissions!);

    if (userPerms?.length)
      return this.replyMissingPermission(interaction, userPerms, 'missingUserPermission');

    const appPerms = appPermissions?.missing(this.props!.appPermissions!);

    if (appPerms?.length)
      return this.replyMissingPermission(interaction, appPerms, 'missingPermission');

    const subcommand = options.getSubcommand();

    return this[subcommand]?.(interaction);
  }

  async single(interaction: ChatInputCommandInteraction<'cached'>) {
    const { guild, locale, member, options } = interaction;

    const user = options.getMember('user');

    if (!(user?.bannable && user.isBannableBy(member)))
      return interaction.editReply(this.t('banHierarchyError', { locale }));

    const deleteMessageDays = options.getInteger('delete_messages') ?? 0;

    const reason = `${member.displayName}: ${options.getString('reason') || '-'}`;

    try {
      await guild.bans.create(user, { deleteMessageDays, reason });

      return interaction.editReply(this.t('userBanned', { locale }));
    } catch {
      return interaction.editReply(this.t('banError', { locale }));
    }
  }

  async chunk(interaction: ChatInputCommandInteraction<'cached'>) {
    const { guild, options } = interaction;

    const usersId = options.getString('users', true).match(/\d{17,}/g);

    if (!usersId)
      return interaction.editReply('No IDs were found in the users input.');

    const usersArray = await guild.members.fetch({ user: usersId })
      .then(members => members.toJSON());

    if (!usersArray.length)
      return interaction.editReply('No users were found in the users input.');

    const days = options.getInteger('delete_messages') ?? 0;

    const reason = options.getString('reason') || '-';

    const embeds = [
      new EmbedBuilder()
        .setDescription(usersArray.join(' ').slice(0, 4096))
        .setFields([{
          name: 'Reason for ban',
          value: reason.slice(0, 1024),
        }, {
          name: 'Delete messages',
          value: days ? `${days} day${days === 1 ? '' : 's'}` : '-',
        }])
        .setTitle(`Chunk of users to ban [${usersArray.length}]`),
    ];

    const components = [
      new ActionRowBuilder<ButtonBuilder>()
        .setComponents([
          new ButtonBuilder()
            .setCustomId(JSON.stringify({
              c: 'ban',
              sc: 'chunk',
              a: true,
            }))
            .setEmoji('⚠')
            .setLabel('Yes')
            .setStyle(ButtonStyle.Primary),
        ]),
    ];

    return interaction.editReply({ components, embeds });
  }
}