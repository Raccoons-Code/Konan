const { SlashCommandBuilder } = require('@discordjs/builders');
const { AutocompleteInteraction, CommandInteraction, MessageEmbed } = require('discord.js');
const { splitSelectMenu } = require('../../methods');

module.exports = class extends SlashCommandBuilder {
  constructor(client) {
    super();
    this.client = client;
    this.t = client.t;
    this.data = this.setName('help')
      .setDescription('Replies with Help!')
      .addStringOption(option => option.setName('command')
        .setDescription('Select a command')
        .setAutocomplete(true));
  }

  /** @param {CommandInteraction} interaction */
  async execute(interaction) {
    this.interaction = interaction;

    if (interaction.isAutocomplete())
      return this.executeAutocomplete();

    const { client, options } = interaction;

    this.embeds = [new MessageEmbed().setColor('RANDOM')];

    const commandName = options.getString('command');

    const commands = client.commands.slash_interaction;

    console.log(commands[commandName]);
    /* await interaction.deferReply({ ephemeral: true, fetchReply: true }); */
  }

  /** @param {AutocompleteInteraction} interaction */
  async executeAutocomplete(interaction = this.interaction) {
    if (interaction.responded) return;

    const { client } = interaction;

    const res = [];

    client.commands.slash_interaction.forEach(e => {
      res.push({
        name: `${this.t(e.data.name, { capitalize: true })} | ${e.data.description}`,
        value: e.data.name,
      });
    });

    interaction.respond(res);
  }
};