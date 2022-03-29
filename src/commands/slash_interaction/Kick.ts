import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, PermissionString } from 'discord.js';
import { Client, SlashCommand } from '../../structures';

export default class Kick extends SlashCommand {
  constructor(client: Client) {
    super(client, {
      clientPermissions: ['KICK_MEMBERS'],
      userPermissions: ['KICK_MEMBERS'],
    });

    this.data = new SlashCommandBuilder().setName('kick')
      .setDescription('Kicks a user from the server.')
      .addUserOption(option => option.setName('user')
        .setDescription('The user to kick.')
        .setRequired(true))
      .addStringOption(option => option.setName('reason')
        .setDescription('Reason for kick.'));
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

    if (!member.kickable)
      return await interaction.editReply(this.t('kickHierarchyError', { locale }));

    const reason = options.getString('reason') || undefined;

    try {
      await guild.members.kick(member, reason);

      await interaction.editReply(this.t('userKicked', { locale }));
    } catch {
      await interaction.editReply(this.t('kickError', { locale }));
    }
  }
}