const { SlashCommand } = require('../../classes');
const { MessageEmbed } = require('discord.js');
const { splitSelectMenu } = require('../../methods');

module.exports = class extends SlashCommand {
  constructor(...args) {
    super(...args);
    this.data = this.setName('help')
      .setDescription('Replies with Help!')
      .addStringOption(option => option.setName('command')
        .setDescription('Select a command')
        .setAutocomplete(true));
  }

  async execute(interaction = this.CommandInteraction) {
    if (interaction.isAutocomplete())
      return this.executeAutocomplete(interaction);

    const { client, options } = interaction;

    const commandName = options.getString('command');

    const commands = client.commands.slash_interaction;

    console.log(commands[commandName]);
    /* await interaction.deferReply({ ephemeral: true, fetchReply: true }); */
  }

  async executeAutocomplete(interaction = this.AutocompleteInteraction) {
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