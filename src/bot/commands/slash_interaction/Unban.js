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
      return this.executeAutocomplete(interaction);

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
  async executeAutocomplete(interaction) {
    if (interaction.responded) return;

    const { guild, options } = interaction;

    const res = [];

    const pattern = options.getString('user');

    const regex = RegExp(pattern, 'i');

    const bans_collection = guild.bans.cache.size ? guild.bans.cache : await guild.bans.fetch();

    const bans_filtered = pattern ? bans_collection.filter(ban => regex.test(ban.user.username) ||
      regex.test(ban.user.id) || regex.test(ban.reason)) : bans_collection;

    const bans_array = bans_filtered.toJSON();

    for (let i = 0; i < bans_array.length; i++) {
      const ban = bans_array[i];

      res.push({
        name: `${ban.user.username}${ban.reason ? ` | Reason: ${ban.reason}` : ''}`,
        value: ban.user.id,
      });

      if (i === 24) break;
    }

    interaction.respond(res);
  }
};