import { EmbedBuilder, ModalSubmitInteraction } from "discord.js";
import ModalSubmit from "../../structures/ModalSubmit";
import { t } from "../../translator";


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

  async addAction(interaction: ModalSubmitInteraction<"cached">) {
    const message = interaction.fields.getTextInputValue("message");

    const [, embed] = interaction.message?.embeds ?? [];

    interaction.message?.embeds.splice(1, 1,
      <any>new EmbedBuilder(embed.toJSON())
        .spliceFields(0, 1, {
          name: t("BlockMessage", interaction.locale),
          value: message || " ",
        }),
    );

    const embeds = interaction.message?.embeds;

    await interaction.editReply({ embeds });

    return;
  }

  async editName(interaction: ModalSubmitInteraction<"cached">) {
    const name = interaction.fields.getTextInputValue("name");

    const [embed] = interaction.message?.embeds ?? [];

    interaction.message?.embeds.splice(0, 1,
      <any>new EmbedBuilder(embed.toJSON())
        .setTitle(name),
    );

    const embeds = interaction.message?.embeds;

    await interaction.editReply({ embeds });

    return;
  }
}
