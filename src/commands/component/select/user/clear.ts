import { EmbedBuilder, userMention, UserSelectMenuInteraction } from "discord.js";
import SelectMenuCommand from "../../../../structures/SelectMenuCommand";

export default class extends SelectMenuCommand {
  constructor() {
    super({
      name: "clear",
    });
  }

  async execute(interaction: UserSelectMenuInteraction<"cached">) {
    const parsedId = JSON.parse(interaction.customId);

    await this[<"users">parsedId?.scg ?? parsedId?.sc]?.(interaction);

    return;
  }

  async users(interaction: UserSelectMenuInteraction<"cached">) {
    const users = interaction.values.map(v => userMention(v));

    await interaction.update({
      embeds: [
        new EmbedBuilder(interaction.message.embeds[0].toJSON())
          .setDescription(users.length ? `Target: ${users.join(" ")}` : null),
      ],
    });

    return;
  }
}
