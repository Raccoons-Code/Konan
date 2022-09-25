import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { SlashCommand } from '../../structures';

export default class Ban extends SlashCommand {
  [x: string]: any;

  constructor() {
    super({
      category: 'Moderation',
      appPermissions: ['BanMembers'],
      userPermissions: ['BanMembers'],
    });

    this.data.setName('ban')
      .setDescription('Bans a user from the server.');
  }

  build() {
    return this.data
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
            name: 'Last 1 hours',
            value: 60 * 60,
            name_localizations: this.getLocalizations('lastNHours', { n: 1 }),
          }, {
            name: 'Last 6 hours',
            value: 60 * 60 * 6,
            name_localizations: this.getLocalizations('lastNHours', { n: 6 }),
          }, {
            name: 'Last 24 hours',
            value: 60 * 60 * 24,
            name_localizations: this.getLocalizations('lastNHours', { n: 24 }),
          }, {
            name: 'Last 3 days',
            value: 60 * 60 * 24 * 3,
            name_localizations: this.getLocalizations('lastNDays', { n: 3 }),
          }, {
            name: 'Last 7 days',
            value: 60 * 60 * 24 * 7,
            name_localizations: this.getLocalizations('lastNDays', { n: 7 }),
          }))
        .addStringOption(option => option.setName('reason')
          .setDescription('The reason for the ban.')
          .setNameLocalizations(this.getLocalizations('banSingleReasonName'))
          .setDescriptionLocalizations(this.getLocalizations('banSingleReasonDescription'))
          .setMaxLength(512)))
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
            name: 'Last 1 hours',
            value: 60 * 60,
            name_localizations: this.getLocalizations('lastNHours', { n: 1 }),
          }, {
            name: 'Last 6 hours',
            value: 60 * 60 * 6,
            name_localizations: this.getLocalizations('lastNHours', { n: 6 }),
          }, {
            name: 'Last 24 hours',
            value: 60 * 60 * 24,
            name_localizations: this.getLocalizations('lastNHours', { n: 24 }),
          }, {
            name: 'Last 3 days',
            value: 60 * 60 * 24 * 3,
            name_localizations: this.getLocalizations('lastNDays', { n: 3 }),
          }, {
            name: 'Last 7 days',
            value: 60 * 60 * 24 * 7,
            name_localizations: this.getLocalizations('lastNDays', { n: 7 }),
          }))
        .addStringOption(option => option.setName('reason')
          .setDescription('The reason for the ban.')
          .setNameLocalizations(this.getLocalizations('banChunkReasonName'))
          .setDescriptionLocalizations(this.getLocalizations('banChunkReasonDescription'))
          .setMaxLength(512)));
  }

  async execute(interaction: ChatInputCommandInteraction<'cached'>): Promise<any> {
    await interaction.deferReply({ ephemeral: true });

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

    const deleteMessageSeconds = options.getInteger('delete_messages') ?? 0;

    const reason = `${member.displayName}: ${options.getString('reason') || '-'}`.slice(0, 512);

    try {
      await guild.bans.create(user, { deleteMessageSeconds, reason });

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

    const seconds = options.getInteger('delete_messages') ?? 0;

    const reason = options.getString('reason') || '-';

    const embeds = [
      new EmbedBuilder()
        .setDescription(usersArray.join(' ').slice(0, 4096))
        .setFields([{
          name: 'Reason for ban',
          value: reason,
        }, {
          name: 'Delete messages',
          value: seconds ? [
            seconds, ' ',
            seconds > (60 * 60 * 24) ? 'day' : 'hour',
            seconds === (60 * 60) || seconds === (60 * 60 * 24) ? '' : 's',
          ].join('') : '-',
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