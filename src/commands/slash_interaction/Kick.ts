import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../../structures';

export default class Kick extends SlashCommand {
  constructor() {
    super({
      category: 'Moderation',
      appPermissions: ['KickMembers'],
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
        .setDescriptionLocalizations(this.getLocalizations('kickReasonDescription'))
        .setMaxLength(512));
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<any> {
    await interaction.deferReply({ ephemeral: true });

    if (!interaction.inCachedGuild())
      return this.replyOnlyOnServer(interaction);

    const { appPermissions, guild, locale, member, memberPermissions, options } = interaction;

    const userPerms = memberPermissions.missing(this.props!.userPermissions!);

    if (userPerms.length)
      return this.replyMissingPermission(interaction, userPerms, 'missingUserPermission');

    const appPerms = appPermissions?.missing(this.props!.appPermissions!);

    if (appPerms?.length)
      return this.replyMissingPermission(interaction, appPerms, 'missingPermission');

    const user = options.getMember('user');

    if (!(user?.kickable && user.isKickableBy(member)))
      return interaction.editReply(this.t('kickHierarchyError', { locale }));

    const reason = `${member.displayName}: ${options.getString('reason') || '-'}`.slice(0, 512);

    try {
      await guild.members.kick(user, reason);

      return interaction.editReply(this.t('userKicked', { locale }));
    } catch {
      return interaction.editReply(this.t('kickError', { locale }));
    }
  }
}