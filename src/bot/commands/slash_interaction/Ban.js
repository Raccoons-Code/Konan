const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction } = require('discord.js');
const { Client } = require('../../classes');

module.exports = class extends SlashCommandBuilder {
	/** @param {Client} client */
  constructor(client) {
    super();
    this.client = client;
    this.t = client.t;
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

  /** @param {CommandInteraction} interaction */
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const { guild, locale, memberPermissions, options } = interaction;

    const member = options.getMember('user');

    const days = options.getNumber('delete_messages');

    const reason = options.getString('reason') || null;

    if (!memberPermissions.has('BAN_MEMBERS'))
      return interaction.editReply(this.t('You are not allowed to ban members from the server.', { locale }));

    if (!member.bannable)
      return interaction.editReply(this.t('You cannot ban members equal or superior to me or you.', { locale }));

    guild.members.ban(member, { days, reason })
      .then(() => interaction.editReply(this.t('User successfully banned!', { locale })))
      .catch(() => interaction.editReply(this.t('Error! Unable to ban this user.', { locale })));
  }
};