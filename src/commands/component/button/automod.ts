import { ButtonInteraction, ComponentType } from "discord.js";
import ButtonCommand from "../../../structures/ButtonCommand";
import { t } from "../../../translator";
import { getAvailableTriggerTypes, getEventTypes } from "../../../util/automod";
import { getEventsSelectOptions, getTriggersSelectOptions } from "../../../util/commands/components/automodselect";
import { toggleButtons } from "../../../util/commands/components/button";
import { addSelectMenuByType, addSelectOptionsToRows, removeSelectByType } from "../../../util/commands/components/selectmenu";
import { componentsHasRowType } from "../../../util/commands/components/utils";

export default class extends ButtonCommand {
  constructor() {
    super({
      name: "automod",
    });
  }

  async execute(interaction: ButtonInteraction<"cached">) {
    await interaction.deferUpdate();

    const parsedId = JSON.parse(interaction.customId);

    await this[<"cancel">parsedId.scg ?? parsedId.sc]?.(interaction);

    return;
  }

  async cancel(interaction: ButtonInteraction<"cached">) {
    await interaction.deleteReply();
  }

  async setExemptChannels(interaction: ButtonInteraction<"cached">) {
    const customId = JSON.stringify({ c: "automod", sc: "setExemptChannels" });

    const hasMenu = componentsHasRowType(
      interaction.message.components,
      ComponentType.ChannelSelect,
    );

    await interaction.editReply({
      components: hasMenu ?
        removeSelectByType(
          interaction.message.components,
          ComponentType.ChannelSelect,
        ) :
        addSelectMenuByType(
          ComponentType.ChannelSelect,
          customId,
          interaction.message.components,
        ),
    });
  }

  async setExemptRoles(interaction: ButtonInteraction<"cached">) {
    const customId = JSON.stringify({ c: "automod", sc: "setExemptRoles" });

    const hasMenu = componentsHasRowType(
      interaction.message.components,
      ComponentType.RoleSelect,
    );

    await interaction.editReply({
      components: hasMenu ?
        removeSelectByType(
          interaction.message.components,
          ComponentType.RoleSelect,
        ) :
        addSelectMenuByType(
          ComponentType.RoleSelect,
          customId,
          interaction.message.components,
        ),
    });
  }

  async setEventType(interaction: ButtonInteraction<"cached">) {
    const customId = JSON.stringify({ c: "automod", sc: "setEventType" });

    await interaction.editReply({
      components: toggleButtons(
        addSelectOptionsToRows(
          interaction.message.components,
          customId,
          getEventsSelectOptions(getEventTypes(), interaction.locale),
          1,
        ),
        customId,
        true,
      ),
    });
  }

  async setTriggerType(interaction: ButtonInteraction<"cached">) {
    const rules = await interaction.guild.autoModerationRules.fetch();

    const availableTriggers = getAvailableTriggerTypes(rules.values());

    if (!availableTriggers.length) {
      await interaction.editReply(t("automodHasMaxRules", interaction.locale));
      return 1;
    }

    const customId = JSON.stringify({ c: "automod", sc: "setTriggerType" });

    await interaction.editReply({
      components: toggleButtons(
        addSelectOptionsToRows(
          interaction.message.components,
          customId,
          getTriggersSelectOptions(availableTriggers, interaction.locale),
          1,
        ),
        customId,
        true,
      ),
    });

    return;
  }
}
