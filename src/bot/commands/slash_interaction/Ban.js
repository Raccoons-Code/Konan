const { SlashCommand } = require('../../classes');

module.exports = class extends SlashCommand {
  constructor(...args) {
    super(...args, {
      clientPermissions: ['BAN_MEMBERS'],
      userPermissions: ['BAN_MEMBERS'],
    });
    this.data = this.setName('ban')
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

  async execute(interaction = this.CommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    if (!interaction.inGuild())
      return interaction.editReply(this.t('onlyOnServer', { locale }));

    const { guild, locale, memberPermissions, options } = interaction;

    const userPermissions = memberPermissions.missing(this.props.userPermissions);

    if (userPermissions.length)
      return interaction.editReply(this.t('missingUserPermission', { locale, PERMISSIONS: userPermissions }));

    const clientPermissions = guild.me.permissions.missing(this.props.clientPermissions);

    if (clientPermissions.length)
      return interaction.editReply(this.t('missingPermission', { locale, PERMISSIONS: clientPermissions }));

    const member = options.getMember('user');

    if (!member.bannable)
      return interaction.editReply(this.t('banHierarchyError', { locale }));

    const days = options.getNumber('delete_messages') || 0;

    const reason = options.getString('reason');

    try {
      await guild.members.ban(member, { days, reason });
      interaction.editReply(this.t('userBanned', { locale }));
    } catch {
      interaction.editReply(this.t('banError', { locale }));
    }
  }
};