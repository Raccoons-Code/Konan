import { ActionRowBuilder, AutoModerationActionType, AutoModerationRuleEventType, AutoModerationRuleTriggerType, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { t } from "../../../translator";
import { ActionTypeString, EventTypeString, TriggerTypeString } from "../../automod";

export function getAddActionsSelectMenu(
  actionTypes: ActionTypeString[],
  locale: string,
) {
  return new ActionRowBuilder<StringSelectMenuBuilder>()
    .addComponents(new StringSelectMenuBuilder()
      .setCustomId(JSON.stringify({
        c: "automod",
        sc: "addAction",
      }))
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
) {
  return new ActionRowBuilder<StringSelectMenuBuilder>()
    .addComponents(new StringSelectMenuBuilder()
      .setCustomId(JSON.stringify({
        c: "automod",
        sc: "setEventType",
      }))
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

export function getTriggersSelectMenu(
  availableTriggers: TriggerTypeString[],
  locale: string,
) {
  return new ActionRowBuilder<StringSelectMenuBuilder>()
    .addComponents(new StringSelectMenuBuilder()
      .setCustomId(JSON.stringify({
        c: "automod",
        sc: "setTriggerType",
      }))
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
