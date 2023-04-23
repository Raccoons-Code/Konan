import { AutoModerationActionType, AutoModerationRule, AutoModerationRuleEventType, AutoModerationRuleKeywordPresetType, AutoModerationRuleTriggerType } from "discord.js";
import { getEnumKeys } from "./utils";

export type TriggerTypeString = keyof typeof AutoModerationRuleTriggerType;

export type EventTypeString = keyof typeof AutoModerationRuleEventType;

export type ActionTypeString = keyof typeof AutoModerationActionType;

export type KeywordPresetTypeString = keyof typeof AutoModerationRuleKeywordPresetType;

export const automodActionTypesByTrigger = {
  [AutoModerationRuleTriggerType.Keyword]: [
    AutoModerationActionType.BlockMessage,
    AutoModerationActionType.SendAlertMessage,
    AutoModerationActionType.Timeout,
  ],
  [AutoModerationRuleTriggerType.Spam]: [
    AutoModerationActionType.BlockMessage,
    AutoModerationActionType.SendAlertMessage,
  ],
  [AutoModerationRuleTriggerType.KeywordPreset]: [
    AutoModerationActionType.BlockMessage,
    AutoModerationActionType.SendAlertMessage,
  ],
  [AutoModerationRuleTriggerType.MentionSpam]: [
    AutoModerationActionType.BlockMessage,
    AutoModerationActionType.SendAlertMessage,
    AutoModerationActionType.Timeout,
  ],
};

export const TriggerLimits: Record<AutoModerationRuleTriggerType, number> = {
  [AutoModerationRuleTriggerType.Keyword]: 6,
  [AutoModerationRuleTriggerType.Spam]: 1,
  [AutoModerationRuleTriggerType.KeywordPreset]: 1,
  [AutoModerationRuleTriggerType.MentionSpam]: 1,
};

export function getAvailableTriggerTypes(rules: Iterable<AutoModerationRule>) {
  const ruleTriggersCount: Record<AutoModerationRuleTriggerType, number> = {
    [AutoModerationRuleTriggerType.Keyword]: 0,
    [AutoModerationRuleTriggerType.Spam]: 0,
    [AutoModerationRuleTriggerType.KeywordPreset]: 0,
    [AutoModerationRuleTriggerType.MentionSpam]: 0,
  };

  for (const rule of rules) {
    ruleTriggersCount[rule.triggerType] ?
      ruleTriggersCount[rule.triggerType]++ :
      ruleTriggersCount[rule.triggerType] = 1;
  }

  return getEnumKeys(AutoModerationRuleTriggerType)
    .filter(t => {
      const type = AutoModerationRuleTriggerType[t];
      return ruleTriggersCount[type] < TriggerLimits[type];
    });
}

export function getEventTypes() {
  return getEnumKeys(AutoModerationRuleEventType);
}

export function getActionTypes(
  triggerType: AutoModerationRuleTriggerType,
) {
  const actions = automodActionTypesByTrigger[triggerType];
  return <ActionTypeString[]>actions.map(t => AutoModerationActionType[t]);
}

export function getKeywordPresetTypes() {
  return getEnumKeys(AutoModerationRuleKeywordPresetType);
}
