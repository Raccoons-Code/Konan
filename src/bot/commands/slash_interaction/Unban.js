const { SlashCommandBuilder } = require('@discordjs/builders');
const { AutocompleteInteraction, CommandInteraction } = require('discord.js');
const { Client } = require('../../classes');

module.exports = class extends SlashCommandBuilder {
	/** @param {Client} client */
  constructor(client) {
    super();
    this.client = client;
    this.t = client.t;
    this.data = this.setName('unban')
      .setDescription('Revokes the ban from the selected user.')
      .addStringOption(option => option.setName('user')
        .setDescription('User id')
        .setAutocomplete(true)
        .setRequired(true))
      .addStringOption(option => option.setName('reason')
        .setDescription('Reason'));
  }

  /** @param {CommandInteraction} interaction */
  async execute(interaction) {
    this.interaction = interaction;

    if (interaction.isAutocomplete())
      return this.executeAutocomplete();

    await interaction.deferReply({ ephemeral: true });

    const { guild, locale, memberPermissions, options } = interaction;

    if (!memberPermissions.has('BAN_MEMBERS'))
      return interaction.editReply(this.t('You are not allowed to unban members from the server.', { locale }));

    const id = options.getString('user');
    const reason = options.getString('reason') || null;

    const ban = guild.bans.cache.get(id) || await guild.bans.fetch(id);

    if (!ban)
      return interaction.editReply(this.t('This user is not banned!', { locale }));

    guild.members.unban(id, reason)
      .then(() => interaction.editReply(this.t('User successfully unbanned!', { locale })))
      .catch(() => interaction.editReply(this.t('Error! Unable to unban this user.', { locale })));
  }

  /** @param {AutocompleteInteraction} interaction */
  async executeAutocomplete(interaction = this.interaction, { guild } = interaction) {
    if (interaction.responded) return;

    const res = [];

    const bans = guild.bans.cache.size && guild.bans.cache || await guild.bans.fetch();

    bans?.forEach(ban => res.push({
      name: `${ban.user.username} | reason: ${ban.reason}`,
      value: ban.user.id,
    }));

    interaction.respond(res);
  }
};