import { ApplicationCommandOptionChoiceData, AutocompleteInteraction } from "discord.js";
import ChatInputAutocomplete from "../../structures/ChatInputAutocomplete";

export default class extends ChatInputAutocomplete {
  constructor() {
    super({
      name: "automod",
      appPermissions: ["ManageGuild"],
      userPermissions: ["ManageGuild"],
    });
  }

  async execute(interaction: AutocompleteInteraction<"cached">) {
    const subcommand = interaction.options.getSubcommandGroup() ??
      interaction.options.getSubcommand();

    const response = await this[<"edit">subcommand]?.(interaction);

    await interaction.respond(response);

    return;
  }

  async edit(
    interaction: AutocompleteInteraction<"cached">,
    res: ApplicationCommandOptionChoiceData[] = [],
  ) {
    const rules = await interaction.guild.autoModerationRules.fetch();

    const ruleName = interaction.options.getString("rule");
    const pattern = RegExp(ruleName ?? "", "i");

    for (const [id, rule] of rules) {
      const name = [
        rule.name,
      ].join(" ");

      if (pattern.test(name)) {
        res.push({
          name: name.slice(0, 100),
          value: id,
        });
      }
    }

    return res;
  }

  async delete(
    interaction: AutocompleteInteraction<"cached">,
    res: ApplicationCommandOptionChoiceData[] = [],
  ) {
    return this.edit(interaction, res);
  }
}
