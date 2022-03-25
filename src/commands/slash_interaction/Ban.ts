import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, PermissionString } from 'discord.js';
import { Client, SlashCommand } from '../../structures';

export default class Ban extends SlashCommand {
  constructor(client: Client) {
    super(client, {
      clientPermissions: ['BAN_MEMBERS'],
      userPermissions: ['BAN_MEMBERS'],
    });

    this.data = new SlashCommandBuilder().setName('ban')
      .setDescription('Ban user.')
      .addUserOption(option => option.setName('user')
        .setDescription('The user to be banned.')
        .setRequired(true))
      .addNumberOption(option => option.setName('delete_messages')
        .setDescription('How much of that person\'s message history should be deleted.')
        .setChoices([['Last 24 hours', 1], ['Last 7 days', 7]]))
      .addStringOption(option => option.setName('reason')
        .setDescription('The reason for banishment, if any.'));
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
      guild.me?.permissions.missing(this.props?.userPermissions as PermissionString[]) || [];

    if (clientPermissions.length)
      return await interaction.editReply(this.t('missingPermission', { locale, PERMISSIONS: clientPermissions }));

    const member = options.getMember('user', true);

    if (!member.bannable)
      return await interaction.editReply(this.t('banHierarchyError', { locale }));

    const days = options.getNumber('delete_messages') || 0;

    const reason = options.getString('reason') as string;

    try {
      await guild.members.ban(member, { days, reason });

      await interaction.editReply(this.t('userBanned', { locale }));
    } catch {
      await interaction.editReply(this.t('banError', { locale }));
    }
  }
}