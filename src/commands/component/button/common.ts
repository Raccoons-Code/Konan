import { ActionRowBuilder, ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import ButtonCommand from "../../../structures/ButtonCommand";

export default class extends ButtonCommand {
  readonly nonDefer = ["dmreply"];

  constructor() {
    super({
      name: "common",
    });
  }

  async execute(interaction: ButtonInteraction) {
    const parsedId = JSON.parse(interaction.customId);

    const subcommand = <"execute">parsedId.scg ?? parsedId.sc;

    if (!this.nonDefer.includes(subcommand))
      await interaction.deferUpdate();

    await this[subcommand]?.(interaction);

    return;
  }

  async cancel(interaction: ButtonInteraction) {
    await interaction.deleteReply();
  }

  async dmreply(interaction: ButtonInteraction) {
    const parsedId = JSON.parse(interaction.customId);

    await interaction.showModal(
      new ModalBuilder()
        .setCustomId(JSON.stringify({ c: "common", sc: "dmreply", userId: parsedId.userId }))
        .setTitle("Reply")
        .addComponents([
          new ActionRowBuilder<TextInputBuilder>()
            .addComponents([
              new TextInputBuilder()
                .setCustomId("content")
                .setLabel("Content")
                .setMaxLength(4096)
                .setStyle(TextInputStyle.Paragraph),
              new TextInputBuilder()
                .setCustomId("title")
                .setLabel("Embed Title")
                .setMaxLength(256)
                .setStyle(TextInputStyle.Short),
              new TextInputBuilder()
                .setCustomId("description")
                .setLabel("Embed Description")
                .setMaxLength(4096)
                .setStyle(TextInputStyle.Paragraph),
            ]),
        ]),
    );
  }
}
