import { SlashCommandBuilder } from '@discordjs/builders';
import TicTacToe from 'discord-tictactoe';
import { CommandInteraction } from 'discord.js';
import { Client, SlashCommand } from '../../structures';

export default class extends SlashCommand {
  constructor(client: Client) {
    super(client, {
      category: 'Game',
    });

    this.data = new SlashCommandBuilder().setName('tictactoe')
      .setDescription('Play a game of Tic Tac Toe with your friends! - Powered by Discord TicTacToe.')
      .setNameLocalizations(this.getLocalizations('tictactoeName'))
      .setDescriptionLocalizations(this.getLocalizations('tictactoeDescription'))
      .addUserOption(option => option.setName('opponent')
        .setDescription('Choose an opponent.')
        .setNameLocalizations(this.getLocalizations('tictactoeOpponentName'))
        .setDescriptionLocalizations(this.getLocalizations('tictactoeOpponentDescription')));
  }

  async execute(interaction: CommandInteraction) {
    const { locale } = interaction;

    const game = new TicTacToe({ language: locale.toLowerCase() });

    game.handleInteraction(interaction);
  }
}