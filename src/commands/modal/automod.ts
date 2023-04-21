import { EmbedBuilder, ModalSubmitInteraction } from "discord.js";
import ModalSubmit from "../../structures/ModalSubmit";


export default class extends ModalSubmit {
  constructor() {
    super({
      name: "automod",
      appPermissions: ["ManageGuild"],
      userPermissions: ["ManageGuild"],
    });
  }

  async execute(interaction: ModalSubmitInteraction<"cached">) {
    await interaction.deferUpdate();

    const parsedId = JSON.parse(interaction.customId);

    await this[<"execute">parsedId.scg ?? parsedId.sc]?.(interaction);

    return;
  }

  async editName(interaction: ModalSubmitInteraction<"cached">) {
    const name = interaction.fields.getTextInputValue("name");

    const [embed] = interaction.message?.embeds ?? [];

    await interaction.editReply({
      embeds: [
        new EmbedBuilder(embed.toJSON())
          .setTitle(name),
      ],
    });

    return;
  }
}
