import { ChatInputCommandInteraction, time } from "discord.js";
import memory from "../../../modules/Memory";
import { MemoryGameMode } from "../../../modules/Memory/@enum";
import ChatInputCommand from "../../../structures/ChatInputCommand";

export default class extends ChatInputCommand {
  constructor() {
    super({
      category: "Game",
    });

    this.data.setName("memory")
      .setDescription("Memory Game");
  }

  build() {
    this.data
      .addIntegerOption(option => option.setName("mode")
        .setDescription("Choose the game mode.")
        .setChoices(
          ...memory.gameModes.map((mode, i) => ({ name: mode, value: i })),
        ))
      .addUserOption(option => option.setName("opponent")
        .setDescription("Choose the opponent."))
      .addStringOption(option => option.setName("emojis")
        .setDescription("Choose the game emojis.")
        .setAutocomplete(true));
  }

  async execute(interaction: ChatInputCommandInteraction) {
    const emojis = <string[]>memory.getEmojis(interaction.options.getString("emojis")!);

    if (emojis && (emojis.length < 5 || emojis.length > 12)) {
      await interaction.reply({
        content: "The emojis must be between 5 and 12 emojis.",
        ephemeral: true,
      });
      return 1;
    }

    const mode = interaction.options.getInteger("mode") ?? 0;

    const opponent = [MemoryGameMode.coop, MemoryGameMode.comp].includes(mode) &&
      interaction.options.getUser("opponent");

    if ([MemoryGameMode.coop, MemoryGameMode.comp].includes(mode) && !opponent) {
      await interaction.reply({
        content: "You must choose an opponent.",
        ephemeral: true,
      });
      return 1;
    }

    const timeToEnd = [MemoryGameMode.coop].includes(mode) ? memory.newTimeToEnd : null;

    const { components } = memory.create({ emojis, mode, time: timeToEnd });

    const oldMessage = await interaction.reply({
      components,
      fetchReply: true,
    });

    if ([MemoryGameMode.limited].includes(mode)) {
      setTimeout(async () => {
        const message = await interaction.channel?.messages.fetch(oldMessage.id).catch(() => null);

        if (!message || memory.checkEnd(message.components)) return;

        await interaction.editReply({
          components: memory.endGame(message.components),
          content: "Game over!",
        });
      }, timeToEnd?.getTime() ?? 0 - Date.now());
    }

    await interaction.editReply({
      content: [
        "Memory Game!",
        `Game mode: ${memory.getGameMode(mode)}${mode === MemoryGameMode.limited ?
          ` | time: ${time(timeToEnd!, "R")}` :
          ""}`,
        `Players: ${opponent ?
          `${interaction.user} ${["", "", "&", "`0` vs `0`"][mode]} ${opponent}` :
          interaction.user}`,
        [false, false, true, true][mode] ?
          `Player: ${[interaction.user, opponent][Math.floor(Math.random() * 2)]}` :
          "",
      ].join("\n"),
    });

    return;
  }
}
