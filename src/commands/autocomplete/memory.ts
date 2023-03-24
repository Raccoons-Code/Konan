import { ApplicationCommandOptionChoiceData, AutocompleteInteraction } from "discord.js";
import memory from "../../modules/Memory";
import ChatInputAutocomplete from "../../structures/ChatInputAutocomplete";

export default class extends ChatInputAutocomplete {
  constructor() {
    super({
      name: "memory",
    });
  }

  async execute(
    interaction: AutocompleteInteraction,
    res: ApplicationCommandOptionChoiceData[] = [],
  ) {
    const focused = interaction.options.getFocused(true);
    const pattern = RegExp(focused.value, "i");

    if (focused.name === "emojis") {
      const emojis = Object.entries(memory.Emojis).filter(a => pattern.test(a[0]));

      for (const emoji of emojis) {
        res.push({
          name: emoji[0],
          value: emoji[0],
        });
      }
    }

    await interaction.respond(res);
    return;
  }
}
