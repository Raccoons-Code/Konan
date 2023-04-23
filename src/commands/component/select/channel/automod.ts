import { ChannelSelectMenuInteraction, EmbedBuilder } from "discord.js";
import SelectMenuCommand from "../../../../structures/SelectMenuCommand";
import { t } from "../../../../translator";
import { automodSuccessButtonCustomId } from "../../../../util/commands/components/automodbutton";
import { toggleButtons } from "../../../../util/commands/components/button";
import { removeSelectMenuById } from "../../../../util/commands/components/selectmenu";
import { embedsHasRequiredFieldsByTrigger } from "../../../../util/commands/embeds/automod";

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

  async setExemptChannels(interaction: ChannelSelectMenuInteraction<"cached">) {
    const [embed] = interaction.message.embeds;

    interaction.message.embeds.splice(0, 1,
      <any>new EmbedBuilder(embed.toJSON())
        .spliceFields(2, 1, {
          name: t("automodExemptChannels", interaction.locale),
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

  async setSendAlertMessageAction(interaction: ChannelSelectMenuInteraction<"cached">) {
    const [, embed] = interaction.message.embeds;

    interaction.message.embeds.splice(1, 1,
      <any>new EmbedBuilder(embed.toJSON())
        .spliceFields(1, 1, {
          name: `ON - ${t("SendAlertMessage", interaction.locale)}`,
          value: interaction.channels.toJSON().join(" ") || " ",
        }),
    );

    const embeds = interaction.message.embeds;

    await interaction.editReply({
      components: toggleButtons(removeSelectMenuById(
        interaction.message.components, [
        interaction.customId,
      ]),
        automodSuccessButtonCustomId,
        !embedsHasRequiredFieldsByTrigger(embeds, interaction.locale)),
      embeds,
    });
  }
}
