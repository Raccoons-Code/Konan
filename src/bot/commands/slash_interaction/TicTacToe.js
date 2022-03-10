const { SlashCommand } = require('../../structures');
const TicTacToe = require('discord-tictactoe');

module.exports = class extends SlashCommand {
  constructor(client) {
    super(client);
    this.data = this.setName('tictactoe')
      .setDescription('TicTacToe - Powered by Discord TicTacToe.')
      .addUserOption(option => option.setName('opponent')
        .setDescription('Opponent'));
  }

  async execute(interaction = this.CommandInteraction) {
    const { locale } = interaction;

    const game = new TicTacToe({ language: locale.toLowerCase() });

    game.handleInteraction(interaction);
  }
};