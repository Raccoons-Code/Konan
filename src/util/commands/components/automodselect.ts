import { AutoModerationRuleTriggerType, Interaction, StringSelectMenuOptionBuilder } from "discord.js";
import { t } from "../../../translator";
import { TriggerTypeString } from "../../automod";

export function getTriggersSelectOptions(
  triggerTypes: TriggerTypeString[],
  interaction: Interaction,
) {
  return triggerTypes
    .map(type => new StringSelectMenuOptionBuilder()
      .setDescription(t(type + "Description", interaction.locale).slice(0, 100))
      .setLabel(t(type, interaction.locale))
      .setValue(JSON.stringify({
        bit: AutoModerationRuleTriggerType[type],
        type,
      })));
}
