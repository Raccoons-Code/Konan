import { ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';
import { SlashCommand } from '../../structures';

export default class Unban extends SlashCommand {
  constructor() {
    super({
      category: 'Moderation',
      appPermissions: ['BanMembers'],
      userPermissions: ['BanMembers'],
    });

    this.data.setName('unban')
      .setDescription('Revoke a user\'s ban.');
  }

  build() {
    return this.data
      .setDMPermission(false)
      .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
      .setNameLocalizations(this.getLocalizations('unbanName'))
      .setDescriptionLocalizations(this.getLocalizations('unbanDescription'))
      .addStringOption(option => option.setName('user')
        .setDescription('User ID')
        .setNameLocalizations(this.getLocalizations('unbanUserName'))
        .setDescriptionLocalizations(this.getLocalizations('unbanUserDescription'))
        .setAutocomplete(true)
        .setRequired(true))
      .addStringOption(option => option.setName('reason')
        .setDescription('The reason to unban.')
        .setNameLocalizations(this.getLocalizations('unbanReasonName'))
        .setDescriptionLocalizations(this.getLocalizations('unbanReasonDescription'))
        .setMaxLength(512));
  }

  async execute(interaction: ChatInputCommandInteraction<'cached'>) {
    const { appPermissions, guild, locale, member, memberPermissions, options } = interaction;

    const userPerms = memberPermissions.missing(this.props!.userPermissions!);

    if (userPerms.length)
      return this.replyMissingPermission(interaction, userPerms, 'missingUserPermission');

    const appPerms = appPermissions?.missing(this.props!.appPermissions!);

    if (appPerms?.length)
      return this.replyMissingPermission(interaction, appPerms, 'missingPermission');

    await interaction.deferReply({ ephemeral: true });

    const id = options.getString('user', true);

    const ban = await guild.bans.fetch(id);

    if (!ban)
      return interaction.editReply(this.t('ban404', { locale }));

    const reason = `${member.displayName}: ${options.getString('reason') || '-'}`.slice(0, 512);

    try {
      await guild.bans.remove(id, reason);

      return interaction.editReply(this.t('userUnbanned', { locale }));
    } catch {
      return interaction.editReply(this.t('unbanError', { locale }));
    }
  }
}