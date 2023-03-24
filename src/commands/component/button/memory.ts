import { ButtonInteraction, userMention } from "discord.js";
import { setTimeout as sleep } from "node:timers/promises";
import memory from "../../../modules/Memory";
import { MemoryGameMode } from "../../../modules/Memory/@enum";
import ButtonCommand from "../../../structures/ButtonCommand";

export default class extends ButtonCommand {
  constructor() {
    super({
      name: "mg",
    });
  }

  async execute(interaction: ButtonInteraction) {
    const matchedPlayers = interaction.message.content.match(/\d{17,}/g);

    if (matchedPlayers?.pop() !== interaction.user.id) {
      await interaction.deferUpdate();
      return 1;
    }

    const { components, play, end, gameOver } =
      memory.check(interaction.message.components, interaction.customId);

    const [title, mode, players, player] = interaction.message.content.split("\n");

    const gameMode = JSON.parse(interaction.customId).m;

    await interaction.update({
      components,
      content: [
        title,
        mode,
        play === 2 ?
          [MemoryGameMode.comp].includes(gameMode) ?
            memory.storeScore(players, interaction.user.id) :
            players : players,
        play === 1 ?
          [MemoryGameMode.coop].includes(gameMode) ?
            `Player: ${userMention(matchedPlayers.find(id => id !== interaction.user.id)!)}` :
            player : player,
      ].join("\n"),
    });

    if (gameOver) {
      await interaction.editReply({
        components: memory.endGame(interaction.message.components),
        content: "Game over!",
      });
      return;
    }

    if (!play) {
      await sleep(1000);

      await interaction.editReply({
        components: memory.setSecondaryButton(interaction.message.components),
        content: [
          title,
          mode,
          players,
          [MemoryGameMode.coop, MemoryGameMode.comp].includes(gameMode) ?
            `Player: ${userMention(matchedPlayers.find(id => id !== interaction.user.id)!)}` :
            "",
        ].join("\n"),
      });

      return;
    }

    if (end) {
      await interaction.editReply({
        content: [
          `Congratulations! ${interaction.user} won the game!`,
          `Congratulations! ${interaction.user} won the game!`,
          `Congratulations! ${userMention(matchedPlayers[0])} & ${userMention(matchedPlayers[1])} won the game!`,
          memory.storeScore(players, interaction.user.id).replace("Players: ", ""),
        ][gameMode],
      });
    }
  }
}
