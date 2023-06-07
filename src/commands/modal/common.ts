import { EmbedBuilder, ModalSubmitInteraction, userMention } from "discord.js";
import client from "../../client";
import ModalSubmit from "../../structures/ModalSubmit";

export default class extends ModalSubmit {
  constructor() {
    super({
      name: "common",
    });
  }

  async execute(interaction: ModalSubmitInteraction) {
    await interaction.deferUpdate();

    const parsedId = JSON.parse(interaction.customId);

    const subcommand = <"execute">parsedId.scg ?? parsedId.sc;

    await this[subcommand]?.(interaction);

    return;
  }

  async dmreply(interaction: ModalSubmitInteraction) {
    const parsedId = JSON.parse(interaction.customId);

    const content = interaction.fields.getTextInputValue("content") || undefined;
    const title = interaction.fields.getTextInputValue("title") || null;
    const description = interaction.fields.getTextInputValue("description") || null;

    const embeds: EmbedBuilder[] = [];

    if (title || description) {
      embeds.push(
        new EmbedBuilder()
          .setTitle(title)
          .setDescription(description),
      );
    }

    await client.users.send(parsedId.userId, {
      content,
      embeds,
    });

    await interaction.followUp({
      content: `Message sended to ${userMention(parsedId.userId)}!`,
      ephemeral: true,
    });

    return;
  }
}
