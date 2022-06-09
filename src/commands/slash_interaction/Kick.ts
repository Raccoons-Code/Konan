import { SlashCommandBuilder } from '@discordjs/builders';
import { Client, CommandInteraction, Permissions } from 'discord.js';
import { SlashCommand } from '../../structures';

export default class Kick extends SlashCommand {
  constructor(client: Client) {
    super(client, {
      category: 'Moderation',
      clientPermissions: ['KICK_MEMBERS'],
      userPermissions: ['KICK_MEMBERS'],
    });

    this.data = new SlashCommandBuilder().setName('kick')
      .setDescription('Kicks a user from the server.')
      .setDMPermission(false)
      .setDefaultMemberPermissions(Permissions.FLAGS.KICK_MEMBERS)
      .setNameLocalizations(this.getLocalizations('kickName'))
      .setDescriptionLocalizations(this.getLocalizations('kickDescription'))
      .addUserOption(option => option.setName('user')
        .setDescription('The user to kick.')
        .setNameLocalizations(this.getLocalizations('kickUserName'))
        .setDescriptionLocalizations(this.getLocalizations('kickUserDescription'))
        .setRequired(true))
      .addStringOption(option => option.setName('reason')
        .setDescription('The reason to kick.')
        .setNameLocalizations(this.getLocalizations('kickReasonName'))
        .setDescriptionLocalizations(this.getLocalizations('kickReasonDescription')));
  }

  async execute(interaction: CommandInteraction): Promise<any> {
    await interaction.deferReply({ ephemeral: true });

    const { locale } = interaction;

    if (!interaction.inCachedGuild())
      return await interaction.editReply(this.t('onlyOnServer', { locale }));

    const { guild, member, memberPermissions, options } = interaction;

    const userPerms = memberPermissions.missing(this.props!.userPermissions!);

    if (userPerms.length)
      return await interaction.editReply(this.t('missingUserPermission', {
        locale,
        permission: this.t(userPerms[0], { locale }),
      }));

    const clientPerms = guild.me?.permissions.missing(this.props!.userPermissions!);

    if (clientPerms?.length)
      return await interaction.editReply(this.t('missingPermission', {
        locale,
        permission: this.t(clientPerms[0], { locale }),
      }));

    const user = options.getMember('user', true);

    if (!(user.kickable && this.isKickable({ author: member, guild, target: user })))
      return await interaction.editReply(this.t('kickHierarchyError', { locale }));

    const reason = `${member.displayName}: ${options.getString('reason') || '-'}`;

    try {
      await guild.members.kick(user, reason);

      await interaction.editReply(this.t('userKicked', { locale }));
    } catch {
      await interaction.editReply(this.t('kickError', { locale }));
    }
  }
}