import { ButtonInteraction, userMention } from 'discord.js';
import { Memory } from '../../modules/Memory';
import { MemoryGameMode } from '../../modules/Memory/@types';
import { ButtonComponentInteraction } from '../../structures';

const { coop, comp } = MemoryGameMode;

export default class extends ButtonComponentInteraction {
  constructor() {
    super({
      name: 'mg',
      description: 'Memory Game',
    });
  }

  async execute(interaction: ButtonInteraction) {
    const { customId, message, user } = interaction;

    const matchedPlayers = message.content.match(/\d{17,}/g);

    if (matchedPlayers?.pop() !== user.id)
      return interaction.deferUpdate();

    const { components, play, end, gameOver } = Memory.check(message.components, customId);

    const [title, mode, players, player] = message.content.split('\n');

    const gameMode = JSON.parse(customId).m;

    await interaction.update({
      components,
      content: [
        title,
        mode,
        play === 2 ?
          [comp].includes(gameMode) ?
            Memory.storeScore(players, user.id) :
            players : players,
        play === 1 ?
          [coop].includes(gameMode) ?
            `Player: ${userMention(matchedPlayers.find(id => id !== user.id)!)}` :
            player : player,
      ].join('\n'),
    });

    if (gameOver)
      return interaction.editReply({
        components: Memory.endGame(message.components),
        content: 'Game over!',
      });

    if (!play) {
      const gameBoard = Memory.setSecondaryButton(message.components);

      await this.Util.waitAsync(1000);

      return interaction.editReply({
        components: gameBoard,
        content: [
          title,
          mode,
          players,
          [coop, comp].includes(gameMode) ?
            `Player: ${userMention(matchedPlayers.find(id => id !== user.id)!)}` :
            '',
        ].join('\n'),
      });
    }

    if (end)
      return interaction.editReply({
        content: [
          `Congratulations! ${user} won the game!`,
          `Congratulations! ${user} won the game!`,
          `Congratulations! ${userMention(matchedPlayers[0])} & ${userMention(matchedPlayers[1])} won the game!`,
          Memory.storeScore(players, user.id).replace('Players: ', ''),
        ][gameMode],
      });
  }
}