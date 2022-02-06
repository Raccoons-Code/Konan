const { SlashCommand } = require('../../classes');

module.exports = class extends SlashCommand {
  constructor(...args) {
    super(...args);
    this.data = this.setName('ban')
      .setDescription('Ban user.')
      .addUserOption(option => option.setName('user')
        .setDescription('The user to be banned.')
        .setRequired(true))
      .addNumberOption(option => option.setName('delete_messages')
        .setDescription('How much of that person\'s message history should be deleted')
        .setChoices([['Last 24 hours', 1], ['Last 7 days', 7]]))
      .addStringOption(option => option.setName('reason')
        .setDescription('The reason for banishment, if any.'));
  }

  async execute(interaction = this.CommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    if (!interaction.inGuild())
      return interaction.editReply(this.t('Error! This command can only be used on one server.', { locale }));

    const { guild, locale, memberPermissions, options } = interaction;

    if (!memberPermissions.has('BAN_MEMBERS'))
      return interaction.editReply(this.t('missingUserPermissions', { locale, permissions: ['BAN_MEMBER'] }));

    if (!guild.me.permissions.has('BAN_MEMBERS'))
      return interaction.editReply(this.t('missingPermissions', { locale, permissions: ['BAN_MEMBER'] }));

    const member = options.getMember('user');

    if (!member.bannable)
      return interaction.editReply(this.t('You cannot ban members equal or superior to me or you.', { locale }));

    const days = options.getNumber('delete_messages') || 0;

    const reason = options.getString('reason');

    guild.members.ban(member, { days, reason })
      .then(() => interaction.editReply(this.t('User successfully banned!', { locale })))
      .catch(() => interaction.editReply(this.t('Error! Unable to ban this user.', { locale })));
  }
};