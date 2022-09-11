import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder, time } from 'discord.js';
import { SlashCommand } from '../../structures';

export default class Timeout extends SlashCommand {
  constructor() {
    super({
      category: 'Moderation',
      appPermissions: ['ModerateMembers'],
      userPermissions: ['ModerateMembers'],
    });

    this.data = new SlashCommandBuilder().setName('timeout')
      .setDescription('Temporarily mute a user.')
      .setDMPermission(false)
      .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
      .setNameLocalizations(this.getLocalizations('timeoutName'))
      .setDescriptionLocalizations(this.getLocalizations('timeoutDescription'))
      .addUserOption(option => option.setName('user')
        .setDescription('The user to mute.')
        .setNameLocalizations(this.getLocalizations('timeoutUserName'))
        .setDescriptionLocalizations(this.getLocalizations('timeoutUserDescription'))
        .setRequired(true))
      .addIntegerOption(option => option.setName('time')
        .setDescription('The time to mute the user for.')
        .setNameLocalizations(this.getLocalizations('timeoutTimeName'))
        .setDescriptionLocalizations(this.getLocalizations('timeoutTimeDescription'))
        .setChoices({
          name: 'Remove timeout',
          value: 0,
          name_localizations: this.getLocalizations('timeoutRemoveTimeoutOption'),
        }, {
          name: '60 seconds',
          value: 1000 * 60,
          name_localizations: this.getLocalizations('timeoutNSecondsOption', { n: 60 }),
        }, {
          name: '5 minutes',
          value: 1000 * 60 * 5,
          name_localizations: this.getLocalizations('timeoutNMinutesOption', { n: 5 }),
        }, {
          name: '10 minutes',
          value: 1000 * 60 * 10,
          name_localizations: this.getLocalizations('timeoutNMinutesOption', { n: 10 }),
        }, {
          name: '1 hour',
          value: 1000 * 60 * 60,
          name_localizations: this.getLocalizations('timeoutNHourOption', { n: 1 }),
        }, {
          name: '1 day',
          value: 1000 * 60 * 60 * 24,
          name_localizations: this.getLocalizations('timeoutNDayOption', { n: 1 }),
        }, {
          name: '1 week',
          value: 1000 * 60 * 60 * 24 * 7,
          name_localizations: this.getLocalizations('timeoutNWeekOption', { n: 1 }),
        })
        .setRequired(true))
      .addStringOption(option => option.setName('reason')
        .setDescription('The reason to mute the user.')
        .setNameLocalizations(this.getLocalizations('timeoutReasonName'))
        .setDescriptionLocalizations(this.getLocalizations('timeoutReasonDescription'))
        .setMaxLength(512));
  }

  async execute(interaction: ChatInputCommandInteraction<'cached'>): Promise<any> {
    await interaction.deferReply({ ephemeral: true });

    const { appPermissions, locale, member, memberPermissions, options } = interaction;

    const userPerms = memberPermissions.missing(this.props!.userPermissions!);

    if (userPerms.length)
      return this.replyMissingPermission(interaction, userPerms, 'missingUserPermission');

    const appPerms = appPermissions?.missing(this.props!.appPermissions!);

    if (appPerms?.length)
      return this.replyMissingPermission(interaction, appPerms, 'missingPermission');

    const user = options.getMember('user');
    if (!(user?.moderatable && user.isModeratableBy(member)))
      return interaction.editReply(this.t('moderateHierarchyError', { locale }));

    const timeout = options.getInteger('time', true);
    const reason = `${member.displayName}: ${options.getString('reason') || '-'}`;

    try {
      await user.timeout(timeout, reason);

      if (!timeout)
        return interaction.editReply(this.t('timeoutRemoved', { locale }));

      const t = Math.floor(((Date.now() + timeout) / 1000));

      return interaction.editReply(this.t('userTimedOut', { locale, time: time(t), timeR: time(t, 'R') }));
    } catch {
      return interaction.editReply(this.t('timeoutError', { locale }));
    }
  }
}