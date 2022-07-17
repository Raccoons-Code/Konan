import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../../structures';

export default class Kick extends SlashCommand {
  constructor() {
    super({
      category: 'Moderation',
      clientPermissions: ['KickMembers'],
      userPermissions: ['KickMembers'],
    });

    this.data = new SlashCommandBuilder().setName('kick')
      .setDescription('Kicks a user from the server.')
      .setDMPermission(false)
      .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
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

  async execute(interaction: ChatInputCommandInteraction): Promise<any> {
    await interaction.deferReply({ ephemeral: true });

    const { locale } = interaction;

    if (!interaction.inCachedGuild())
      return interaction.editReply(this.t('onlyOnServer', { locale }));

    const { appPermissions, guild, member, memberPermissions, options } = interaction;

    const userPerms = memberPermissions.missing(this.props!.userPermissions!);

    if (userPerms.length)
      return interaction.editReply(this.t('missingUserPermission', {
        locale,
        permission: this.t(userPerms[0], { locale }),
      }));

    const clientPerms = appPermissions?.missing(this.props!.clientPermissions!);

    if (clientPerms?.length)
      return interaction.editReply(this.t('missingPermission', {
        locale,
        permission: this.t(clientPerms[0], { locale }),
      }));

    const user = options.getMember('user');

    if (!(user?.kickable && this.isKickable({ author: member, guild, target: user })))
      return interaction.editReply(this.t('kickHierarchyError', { locale }));

    const reason = `${member.displayName}: ${options.getString('reason') || '-'}`;

    try {
      await guild.members.kick(user, reason);

      return interaction.editReply(this.t('userKicked', { locale }));
    } catch {
      return interaction.editReply(this.t('kickError', { locale }));
    }
  }
}