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
      const emojis = Object.keys(memory.Emojis)
        .filter(a => pattern.test(a));

      for (const emoji of emojis) {
        res.push({
          name: emoji,
          value: emoji,
        });
      }
    }

    await interaction.respond(res);
    return;
  }
}
