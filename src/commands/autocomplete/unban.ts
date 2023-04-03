import { ApplicationCommandOptionChoiceData, AutocompleteInteraction } from "discord.js";
import ChatInputAutocomplete from "../../structures/ChatInputAutocomplete";

export default class extends ChatInputAutocomplete {
  constructor() {
    super({
      name: "unban",
      appPermissions: ["BanMembers"],
      userPermissions: ["BanMembers"],
    });
  }

  async execute(
    interaction: AutocompleteInteraction<"cached">,
    res: ApplicationCommandOptionChoiceData[] = [],
  ) {
    const user = interaction.options.getString("user");
    const pattern = RegExp(user ?? "", "i");

    const bans = await interaction.guild.bans.fetch();

    for (const ban of bans.values()) {
      const name = [
        ban.user.tag, " | ", ban.user.id,
        ban.reason ? ` | Reason: ${ban.reason}` : "",
      ].join("");

      if (pattern.test(name)) {
        res.push({
          name: name.slice(0, 100),
          value: ban.user.id,
        });

        if (res.length === 25) break;
      }
    }

    await interaction.respond(res);

    return;
  }
}
