import { ActionRowBuilder, AutoModerationActionType, AutoModerationRuleEventType, AutoModerationRuleKeywordPresetType, AutoModerationRuleTriggerType, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { t } from "../../../translator";
import { ActionTypeString, EventTypeString, KeywordPresetTypeString, TriggerTypeString } from "../../automod";

const c = "automod";

export function getAddActionsSelectMenu(
  actionTypes: ActionTypeString[],
  locale: string,
  disabled = false,
) {
  return new ActionRowBuilder<StringSelectMenuBuilder>()
    .addComponents(new StringSelectMenuBuilder()
      .setCustomId(JSON.stringify({
        c,
        sc: "addAction",
      }))
      .setDisabled(disabled)
      .setPlaceholder("Set the action type.")
      .addOptions(getAddActionsSelectOptions(actionTypes, locale)));
}

export function getAddActionsSelectOptions(
  actionTypes: ActionTypeString[],
  locale: string,
) {
  return actionTypes
    .map(type => new StringSelectMenuOptionBuilder()
      .setDescription(t(type + "Description", locale).slice(0, 100))
      .setLabel(t(type, locale))
      .setValue(JSON.stringify({
        bit: AutoModerationActionType[type],
        type,
      })));
}

export function getEventsSelectMenu(
  eventTypes: EventTypeString[],
  locale: string,
  disabled = false,
) {
  return new ActionRowBuilder<StringSelectMenuBuilder>()
    .addComponents(new StringSelectMenuBuilder()
      .setCustomId(JSON.stringify({
        c,
        sc: "setEventType",
      }))
      .setDisabled(disabled)
      .setPlaceholder("Set the event type.")
      .addOptions(getEventsSelectOptions(eventTypes, locale)));
}

export function getEventsSelectOptions(
  eventTypes: EventTypeString[],
  locale: string,
) {
  return eventTypes
    .map(type => new StringSelectMenuOptionBuilder()
      .setDescription(t(type + "Description", locale).slice(0, 100))
      .setLabel(t(type, locale))
      .setValue(JSON.stringify({
        bit: AutoModerationRuleEventType[type],
        type,
      })));
}

export function getKeywordPresetsSelectMenu(
  keywordPresets: KeywordPresetTypeString[],
  locale: string,
  disabled = false,
) {
  return new ActionRowBuilder<StringSelectMenuBuilder>()
    .addComponents(new StringSelectMenuBuilder()
      .setCustomId(JSON.stringify({
        c,
        sc: "setKeywordPresets",
      }))
      .setDisabled(disabled)
      .setPlaceholder("Set keyword presets list.")
      .addOptions(getKeywordPresetsSelectOptions(keywordPresets, locale)));
}

export function getKeywordPresetsSelectOptions(
  keywordPresets: KeywordPresetTypeString[],
  locale: string,
) {
  return keywordPresets
    .map(type => new StringSelectMenuOptionBuilder()
      .setDescription(t(type + "Description", locale).slice(0, 100))
      .setLabel(t(type, locale))
      .setValue(JSON.stringify({
        bit: AutoModerationRuleKeywordPresetType[type],
        type,
      })));
}

export function getTriggersSelectMenu(
  availableTriggers: TriggerTypeString[],
  locale: string,
  disabled = false,
) {
  return new ActionRowBuilder<StringSelectMenuBuilder>()
    .addComponents(new StringSelectMenuBuilder()
      .setCustomId(JSON.stringify({
        c,
        sc: "setTriggerType",
      }))
      .setDisabled(disabled)
      .setPlaceholder("Set the trigger type.")
      .addOptions(getTriggersSelectOptions(availableTriggers, locale)));
}

export function getTriggersSelectOptions(
  triggerTypes: TriggerTypeString[],
  locale: string,
) {
  return triggerTypes
    .map(type => new StringSelectMenuOptionBuilder()
      .setDescription(t(type + "Description", locale).slice(0, 100))
      .setLabel(t(type, locale))
      .setValue(JSON.stringify({
        bit: AutoModerationRuleTriggerType[type],
        type,
      })));
}
