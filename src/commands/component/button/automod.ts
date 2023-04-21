import { ButtonInteraction } from "discord.js";
import ButtonCommand from "../../../structures/ButtonCommand";
import { t } from "../../../translator";
import { getAvailableTriggerTypes } from "../../../util/automod";
import { getTriggersSelectOptions } from "../../../util/commands/components/automodselect";
import { toggleButtons } from "../../../util/commands/components/button";
import { addSelectOptionsToRows } from "../../../util/commands/components/selectmenu";

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

  async setTriggerType(interaction: ButtonInteraction<"cached">) {
    const rules = await interaction.guild.autoModerationRules.fetch();

    const availableTriggers = getAvailableTriggerTypes(rules.values());

    if (!availableTriggers.length) {
      await interaction.editReply(t("automodHasMaxRules", interaction.locale));
      return 1;
    }

    const customId = JSON.stringify({ c: "automod", sc: "setTriggerType" });
    console.log("button");
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
