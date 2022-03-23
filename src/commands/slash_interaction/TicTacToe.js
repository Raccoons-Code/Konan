const { SlashCommandBuilder } = require('@discordjs/builders');
const TicTacToe = require('discord-tictactoe');
const { CommandInteraction } = require('discord.js');
const { Client, SlashCommand } = require('../../structures');

module.exports = class extends SlashCommand {
  /** @param {Client} client */
  constructor(client) {
    super(client);

    this.data = new SlashCommandBuilder().setName('tictactoe')
      .setDescription('TicTacToe - Powered by Discord TicTacToe.')
      .addUserOption(option => option.setName('opponent')
        .setDescription('Opponent'));
  }

  /** @param {CommandInteraction} interaction */
  async execute(interaction) {
    const { locale } = interaction;

    const game = new TicTacToe({ language: locale.toLowerCase() });

    game.handleInteraction(interaction);
  }
};