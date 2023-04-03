import { ApplicationCommandOptionChoiceData, AutocompleteInteraction } from "discord.js";
import commandHandler from "../../handlers/CommandHandler";
import ChatInputAutocomplete from "../../structures/ChatInputAutocomplete";

export default class Help extends ChatInputAutocomplete {
  constructor() {
    super({
      name: "help",
    });
  }

  async execute(
    interaction: AutocompleteInteraction,
    res: ApplicationCommandOptionChoiceData[] = [],
  ) {
    const locale = interaction.locale;

    const focused = interaction.options.getFocused(true);
    const pattern = RegExp(focused.value, "i");

    if (focused.name === "command") {
      let commands = commandHandler.chatInputApplicationCommands.toJSON();

      if (!commands?.length) {
        await interaction.respond(res);
        return 1;
      }

      if (focused.value) {
        commands = commands.filter(c => {
          if (c.options?.private) return false;
          if (c.data.name_localizations?.[locale]) {
            if (pattern.test(c.data.name_localizations[locale]!)) return true;
          }
          if (c.data.description_localizations?.[locale]) {
            if (pattern.test(c.data.description_localizations[locale]!)) return true;
          }
          return pattern.test(c.data.name) || pattern.test(c.data.description);
        });
      }

      for (const command of commands) {
        const name = [
          command.data.name_localizations?.[locale] ?? command.data.name,
          command.data.description_localizations?.[locale] ?? command.data.description,
        ].join(" | ").slice(0, 100);

        res.push({
          name,
          value: command.data.name,
        });

        if (res.length === 25) break;
      }
    }

    await interaction.respond(res);
    return;
  }
}
