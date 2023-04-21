import { EmbedBuilder, StringSelectMenuInteraction } from "discord.js";
import { AutomodEnumOptionValue } from "../../../../@types";
import SelectMenuCommand from "../../../../structures/SelectMenuCommand";
import { t } from "../../../../translator";
import { TriggerTypeString, getAvailableTriggerTypes } from "../../../../util/automod";
import { getTriggersSelectOptions } from "../../../../util/commands/components/automodselect";
import { removeSelectMenuByCustomId, setSelectMenuOptions } from "../../../../util/commands/components/selectmenu";

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

    const [value] = <TriggerTypeString[]>interaction.values;

    const parsedValue = <AutomodEnumOptionValue>JSON.parse(value);

    if (!availableTriggerTypes.includes(<TriggerTypeString>parsedValue.type)) {
      await Promise.all([
        interaction.editReply({
          components: setSelectMenuOptions(
            interaction.message.components,
            interaction.customId,
            getTriggersSelectOptions(availableTriggerTypes, interaction),
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

    await interaction.editReply({
      components: removeSelectMenuByCustomId(
        interaction.message.components,
        interaction.customId,
      ),
      embeds: [
        new EmbedBuilder(interaction.message.embeds[0].toJSON())
          .spliceFields(0, 1, {
            name: "Trigger Type",
            value: `${parsedValue.bit} - ${t(parsedValue.type, interaction.locale)}`,
          }),
      ],
    });
  }
}
