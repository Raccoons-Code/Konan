const { SlashCommandBuilder } = require('@discordjs/builders');
const { AutocompleteInteraction, CommandInteraction } = require('discord.js');
const { Client } = require('../../classes');
const { DiscordTogether } = require('discord-together');

module.exports = class extends SlashCommandBuilder {
	/** @param {Client} client */
  constructor(client) {
    super();
    this.discord_together = new DiscordTogether(client);
    client.discord_together = this.discord_together;
    this.client = client;
    this.t = client.t;
    this.data = this.setName('party')
      .setDescription('Create an activity party together')
      .addStringOption(option => option.setName('activity')
        .setDescription('Select activity')
        .setAutocomplete(true)
        .setRequired(true));
  }

  /** @param {CommandInteraction} interaction */
  async execute(interaction) {
    this.interaction = interaction;

    if (interaction.isAutocomplete())
      return this.executeAutocomplete(interaction);

    const { locale, member, options } = interaction;

    if (!member.voice.channel)
      return interaction.reply({
        content: `${member}, ${this.t('you must be on a voice channel.', { locale })}`,
        ephemeral: true,
      });

    this.discord_together.createTogetherCode(member.voice.channel.id, options.getString('activity'))
      .then(async invite => this.timeout_erase(await interaction.reply(`${invite.code}`), 60))
      .catch(() => interaction.reply({
          content: this.t('This activity does not exist.', { locale }),
          ephemeral: true,
      }));
  }

  /** @param {AutocompleteInteraction} interaction */
  async executeAutocomplete(interaction = this.interaction) {
    if (interaction.responded) return;

    const { locale } = interaction;

    const res = [];

    Object.keys(this.discord_together.applications).forEach(application => {
      if (!/(dev$)/i.test(application))
        res.push({
          name: `${this.t(application, { locale, capitalize: true })}`,
          value: `${application}`,
        });
    });

    interaction.respond(res);
  }

  /**
   * @description delete one interaction with async timeout delay
   * @param {Seconds<Number>} timeout
   * @async
   */
  async timeout_erase(interaction = this.interaction, timeout = 0) {
    if (!interaction) return console.error('Unable to delete undefined interaction.');
    await this.client.util.waitAsync(timeout * 1000);
    return await interaction.deleteReply().catch(() => null);
  }
};