import { EmbedBuilder, StringSelectMenuInteraction } from "discord.js";
import { AutomodEnumOptionValue } from "../../../../@types";
import SelectMenuCommand from "../../../../structures/SelectMenuCommand";
import { t } from "../../../../translator";
import { TriggerTypeString, getAvailableTriggerTypes } from "../../../../util/automod";
import { getTriggersSelectOptions } from "../../../../util/commands/components/automodselect";
import { toggleButtons } from "../../../../util/commands/components/button";
import { removeSelectMenuById, setSelectMenuOptions } from "../../../../util/commands/components/selectmenu";

export default class extends SelectMenuCommand {
  constructor() {
    super({
      name: "automod",
      appPermissions: ["ManageGuild"],
      userPermissions: ["ManageGuild"],
    });
  }

  async execute(interaction: StringSelectMenuInteraction<"cached">) {
    await interaction.deferUpdate();

    const parsedId = JSON.parse(interaction.customId);

    await this[<"setTriggerType">parsedId?.scg ?? parsedId?.sc]?.(interaction);

    return;
  }

  async setEventType(interaction: StringSelectMenuInteraction<"cached">) {
    const [value] = interaction.values;

    const parsedValue = <AutomodEnumOptionValue>JSON.parse(value);

    const [embed] = interaction.message.embeds;

    await interaction.editReply({
      components: toggleButtons(
        removeSelectMenuById(
        interaction.message.components,
        interaction.customId,
        ),
        JSON.stringify({ c: "automod", sc: "setEventType" }),
        false,
      ),
      embeds: [
        new EmbedBuilder(embed.toJSON())
          .spliceFields(1, 1, {
            name: t("automodFieldEventType", interaction.locale),
            value: `${parsedValue.bit} - ${t(parsedValue.type, interaction.locale)}`,
          }),
      ],
    });
  }

  async setTriggerType(interaction: StringSelectMenuInteraction<"cached">) {
    const rules = await interaction.guild.autoModerationRules.fetch();

    const availableTriggerTypes = getAvailableTriggerTypes(rules.values());

    if (!availableTriggerTypes.length) {
      await interaction.editReply({
        components: [],
        content: t("automodHasMaxRules", interaction.locale),
        embeds: [],
      });
      return 1;
    }

    const [value] = interaction.values;

    const parsedValue = <AutomodEnumOptionValue>JSON.parse(value);

    if (!availableTriggerTypes.includes(<TriggerTypeString>parsedValue.type)) {
      await Promise.all([
        interaction.editReply({
          components: setSelectMenuOptions(
            interaction.message.components,
            interaction.customId,
            getTriggersSelectOptions(availableTriggerTypes, interaction.locale),
          ),
        }),
        interaction.followUp({
          content: t("automodHasMaxRulesFor", {
            locale: interaction.locale,
            value: t(parsedValue.type, interaction.locale),
          }),
          ephemeral: true,
        }),
      ]);
      return 1;
    }

    const [embed] = interaction.message.embeds;

    await interaction.editReply({
      components: toggleButtons(
        removeSelectMenuById(
        interaction.message.components,
        interaction.customId,
      ),
        JSON.stringify({ c: "automod", sc: "setTriggerType" }),
        false,
      ),
      embeds: [
        new EmbedBuilder(embed.toJSON())
          .spliceFields(0, 1, {
            name: t("automodFieldTriggerType", interaction.locale),
            value: `${parsedValue.bit} - ${t(parsedValue.type, interaction.locale)}`,
          }),
      ],
    });
  }
}
