const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction } = require('discord.js');
const { DiscordTogether } = require('discord-together');

module.exports = class extends SlashCommandBuilder {
  constructor(client) {
    super();
    this.discord_together = new DiscordTogether(client);
    client.discord_together = this.discord_together;
    this.client = client;
    this.data = this.setName('party')
      .setDescription('Create a application together party')
      .addStringOption(option => option.setName('application')
        .setDescription('Select application')
        .setAutocomplete(true)
        .setRequired(true));
    this.t = client.t;
  }

  /** @param {CommandInteraction} interaction */
  async execute(interaction) {
    this.interaction = interaction;

    const { locale, member, options } = interaction;

    if (interaction.isAutocomplete())
      return this.executeAutocomplete();

    if (!member.voice.channel)
      return interaction.reply({
        content: `${member}, ${this.t('you must be on a voice channel', { locale })}.`,
        ephemeral: true,
      });

    this.discord_together.createTogetherCode(member.voice.channel.id, options.getString('application'))
      .then(invite => interaction.reply(`${invite.code}`));
  }

  /** @param {AutocompleteInteraction} interaction */
  async executeAutocomplete(interaction = this.interaction) {
    if (interaction.responded) return;

    const res = [];

    Object.keys(this.discord_together.applications).forEach(application => {
      res.push({
        name: `${application}`,
        value: `${application}`,
      });
    });

    interaction.respond(res);
  }
};