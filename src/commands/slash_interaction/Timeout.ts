import { SlashCommandBuilder, time } from '@discordjs/builders';
import { CommandInteraction, PermissionString } from 'discord.js';
import { Client, SlashCommand } from '../../structures';

export default class Timeout extends SlashCommand {
  constructor(client: Client) {
    super(client, {
      category: 'Moderation',
      clientPermissions: ['MODERATE_MEMBERS'],
      userPermissions: ['MODERATE_MEMBERS'],
    });

    this.data = new SlashCommandBuilder().setName('timeout')
      .setDescription('Temporarily mutes a user.')
      .addUserOption(option => option.setName('user')
        .setDescription('The user to timeout.')
        .setRequired(true))
      .addIntegerOption(option => option.setName('time')
        .setDescription('Time to timeout the user.')
        .setChoices([
          ['Remove timeout', 0],
          ['60 seconds', 1000 * 60],
          ['5 minutes', 1000 * 60 * 5],
          ['10 minutes', 1000 * 60 * 10],
          ['1 hour', 1000 * 60 * 60],
          ['1 day', 1000 * 60 * 60 * 24],
          ['1 week', 1000 * 60 * 60 * 24 * 7],
        ])
        .setRequired(true))
      .addStringOption(option => option.setName('reason')
        .setDescription('Reason for timeout.'));
  }

  async execute(interaction: CommandInteraction): Promise<any> {
    await interaction.deferReply({ ephemeral: true });

    const { locale } = interaction;

    if (!interaction.inCachedGuild())
      return await interaction.editReply(this.t('onlyOnServer', { locale }));

    const { guild, memberPermissions, options } = interaction;

    const userPermissions = memberPermissions.missing(this.props?.userPermissions as PermissionString[]);

    if (userPermissions.length)
      return await interaction.editReply(this.t('missingUserPermission', {
        locale,
        PERMISSIONS: userPermissions,
      }));

    const clientPermissions =
      guild.me?.permissions.missing(this.props?.userPermissions as PermissionString[]) ?? [];

    if (clientPermissions.length)
      return await interaction.editReply(this.t('missingPermission', { locale, PERMISSIONS: clientPermissions }));

    const member = options.getMember('user', true);
    const timeout = options.getInteger('time', true);
    const reason = options.getString('reason') ?? undefined;

    try {
      await member.timeout(timeout, reason);

      if (!timeout)
        return await interaction.editReply(this.t('timeoutRemoved', { locale }));

      const t = Math.floor(((Date.now() + timeout) / 1000));

      await interaction.editReply(this.t('userTimedOut', { locale, time: time(t), timeR: time(t, 'R') }));
    } catch {
      await interaction.editReply(this.t('timeoutError', { locale }));
    }
  }
}