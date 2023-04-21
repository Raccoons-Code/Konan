import { ChannelSelectMenuInteraction, EmbedBuilder } from "discord.js";
import SelectMenuCommand from "../../../../structures/SelectMenuCommand";
import { t } from "../../../../translator";
import { removeSelectMenuById } from "../../../../util/commands/components/selectmenu";

export default class extends SelectMenuCommand {
  constructor() {
    super({
      name: "automod",
      appPermissions: ["ManageGuild"],
      userPermissions: ["ManageGuild"],
    });
  }

  async execute(interaction: ChannelSelectMenuInteraction<"cached">) {
    await interaction.deferUpdate();

    const parsedId = JSON.parse(interaction.customId);

    await this[<"setExemptChannels">parsedId?.scg ?? parsedId?.sc]?.(interaction);

    return;
  }

  async setExemptChannels(interaction: ChannelSelectMenuInteraction<"cached">) {
    const [embed] = interaction.message.embeds;

    await interaction.editReply({
      components: removeSelectMenuById(
        interaction.message.components,
        interaction.customId,
      ),
      embeds: [
        new EmbedBuilder(embed.toJSON())
          .spliceFields(2, 1, {
            name: t("automodFieldExemptChannels", interaction.locale),
            value: interaction.channels.toJSON().join(" ") || "-",
          }),
      ],
    });
  }
}
