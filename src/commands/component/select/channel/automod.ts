import { ChannelSelectMenuInteraction, ComponentType, EmbedBuilder } from "discord.js";
import SelectMenuCommand from "../../../../structures/SelectMenuCommand";
import { t } from "../../../../translator";
import { toggleButtons } from "../../../../util/commands/components/button";
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

    await this[<"execute">parsedId?.scg ?? parsedId?.sc]?.(interaction);

    return;
  }

  async addAction(interaction: ChannelSelectMenuInteraction<"cached">) {
    const [, embed] = interaction.message.embeds;

    interaction.message.embeds.splice(1, 1,
      <any>new EmbedBuilder(embed.toJSON())
        .spliceFields(1, 1, {
          name: t("SendAlertMessage", interaction.locale),
          value: interaction.channels.toJSON().join(" ") || " ",
        }),
    );

    const embeds = interaction.message.embeds;

    await interaction.editReply({
      components: toggleButtons(
        removeSelectMenuById(
          interaction.message.components, [
          interaction.customId,
          JSON.stringify({
            c: "automod",
            sc: "addAction",
            a: ComponentType.StringSelect,
          }),
        ]), [
        JSON.stringify({ c: "automod", sc: "addAction" }),
        JSON.stringify({ c: "automod", sc: "remAction" }),
      ],
        false,
      ),
      embeds,
    });
  }

  async setExemptChannels(interaction: ChannelSelectMenuInteraction<"cached">) {
    const [embed] = interaction.message.embeds;

    interaction.message.embeds.splice(0, 1,
      <any>new EmbedBuilder(embed.toJSON())
        .spliceFields(2, 1, {
          name: t("automodFieldExemptChannels", interaction.locale),
          value: interaction.channels.toJSON().join(" ") || " ",
        }),
    );

    const embeds = interaction.message.embeds;

    await interaction.editReply({
      components: removeSelectMenuById(
        interaction.message.components,
        interaction.customId,
      ),
      embeds,
    });
  }
}
