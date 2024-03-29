import { AutoModerationRuleTriggerType, ButtonBuilder, ButtonStyle } from "discord.js";
import { t } from "../../../translator";

const c = "automod";

export const automodButtonsCustomId = {
  addAction: JSON.stringify({ c, sc: "addAction" }),
  editName: JSON.stringify({ c, sc: "editName" }),
  remAction: JSON.stringify({ c, sc: "remAction" }),
  setAllowList: JSON.stringify({ c, sc: "setAllowList" }),
  setEventType: JSON.stringify({ c, sc: "setEventType" }),
  setExemptChannels: JSON.stringify({ c, sc: "setExemptChannels" }),
  setExemptRoles: JSON.stringify({ c, sc: "setExemptRoles" }),
  setKeywordFilter: JSON.stringify({ c, sc: "setKeywordFilter" }),
  setKeywordPresets: JSON.stringify({ c, sc: "setKeywordPresets" }),
  setMentionTotalLimit: JSON.stringify({ c, sc: "setMentionTotalLimit" }),
  setRegexPatterns: JSON.stringify({ c, sc: "setRegexPatterns" }),
  setTriggerType: JSON.stringify({ c, sc: "setTriggerType" }),
};

export const automodSuccessButtonCustomId = JSON.stringify({
  c,
  sc: "success",
});

export const automodToggleButtonsByTrigger = {
  [AutoModerationRuleTriggerType.Keyword]: {
    enable: [
      automodButtonsCustomId.setAllowList,
      automodButtonsCustomId.setKeywordFilter,
      automodButtonsCustomId.setRegexPatterns,
    ],
    disable: [
      automodButtonsCustomId.setKeywordPresets,
      automodButtonsCustomId.setMentionTotalLimit,
    ],
    required: [
      automodButtonsCustomId.setKeywordFilter,
      automodButtonsCustomId.setRegexPatterns,
    ],
  },
  [AutoModerationRuleTriggerType.KeywordPreset]: {
    enable: [
      automodButtonsCustomId.setAllowList,
      automodButtonsCustomId.setKeywordPresets,
    ],
    disable: [
      automodButtonsCustomId.setKeywordFilter,
      automodButtonsCustomId.setMentionTotalLimit,
      automodButtonsCustomId.setRegexPatterns,
    ],
    required: [
      automodButtonsCustomId.setKeywordPresets,
    ],
  },
  [AutoModerationRuleTriggerType.MentionSpam]: {
    enable: [
      automodButtonsCustomId.setMentionTotalLimit,
    ],
    disable: [
      automodButtonsCustomId.setAllowList,
      automodButtonsCustomId.setKeywordFilter,
      automodButtonsCustomId.setKeywordPresets,
      automodButtonsCustomId.setRegexPatterns,
    ],
    required: [
      automodButtonsCustomId.setMentionTotalLimit,
    ],
  },
  [AutoModerationRuleTriggerType.Spam]: {
    enable: [],
    disable: [
      automodButtonsCustomId.setAllowList,
      automodButtonsCustomId.setKeywordFilter,
      automodButtonsCustomId.setKeywordPresets,
      automodButtonsCustomId.setMentionTotalLimit,
      automodButtonsCustomId.setRegexPatterns,
    ],
    required: [],
  },
};

export function getEditButtonsByTrigger(
  trigger: AutoModerationRuleTriggerType,
  locale: string,
  enabled = true,
) {
  return [[
    getEditNameButton(locale),
    getTriggersButton(locale, true),
    getEventsButton(locale),
    getAddActionButton(locale),
    getRemActionButton(locale),
  ], [
    getSuccessButton(true),
    getCancelButton(),
    getToggleButton(locale, !enabled),
    getExemptChannelsButton(locale),
    getExemptRolesButton(locale),
  ], [
    getAllowListButton(locale, ![
      AutoModerationRuleTriggerType.KeywordPreset,
      AutoModerationRuleTriggerType.Keyword,
    ].includes(trigger)),
    getKeywordFilterButton(locale, ![
      AutoModerationRuleTriggerType.KeywordPreset,
      AutoModerationRuleTriggerType.Keyword,
    ].includes(trigger)),
    getKeywordPresetsButton(locale, ![
      AutoModerationRuleTriggerType.KeywordPreset,
    ].includes(trigger)),
    getMentionTotalLimitButton(locale, ![
      AutoModerationRuleTriggerType.MentionSpam,
    ].includes(trigger)),
    getRegexPatternsButton(locale, ![
      AutoModerationRuleTriggerType.Keyword,
    ].includes(trigger)),
  ]];
}

export function getSuccessButton(disabled = false) {
  return new ButtonBuilder()
    .setCustomId(automodSuccessButtonCustomId)
    .setDisabled(disabled)
    .setEmoji("✅")
    .setStyle(ButtonStyle.Success);
}

export function getCancelButton(disabled = false) {
  return new ButtonBuilder()
    .setCustomId(JSON.stringify({ c, sc: "cancel" }))
    .setDisabled(disabled)
    .setEmoji("✖️")
    .setStyle(ButtonStyle.Danger);
}

export function getAddActionButton(locale: string, disabled = false) {
  return new ButtonBuilder()
    .setCustomId(automodButtonsCustomId.addAction)
    .setDisabled(disabled)
    .setLabel(t("automodAddAction", locale))
    .setStyle(ButtonStyle.Primary);
}

export function getRemActionButton(locale: string, disabled = false) {
  return new ButtonBuilder()
    .setCustomId(automodButtonsCustomId.remAction)
    .setDisabled(disabled)
    .setLabel(t("automodRemAction", locale))
    .setStyle(ButtonStyle.Secondary);
}

export function getAllowListButton(locale: string, disabled = false) {
  return new ButtonBuilder()
    .setCustomId(automodButtonsCustomId.setAllowList)
    .setDisabled(disabled)
    .setLabel(t("automodAllowList", locale))
    .setStyle(ButtonStyle.Secondary);
}

export function getEditNameButton(locale: string, disabled = false) {
  return new ButtonBuilder()
    .setCustomId(automodButtonsCustomId.editName)
    .setDisabled(disabled)
    .setLabel(t("automodRuleEditName", locale))
    .setStyle(ButtonStyle.Secondary);
}

export function getEventsButton(locale: string, disabled = false) {
  return new ButtonBuilder()
    .setCustomId(automodButtonsCustomId.setEventType)
    .setDisabled(disabled)
    .setLabel(t("automodEventType", locale))
    .setStyle(ButtonStyle.Primary);
}

export function getExemptChannelsButton(locale: string, disabled = false) {
  return new ButtonBuilder()
    .setCustomId(automodButtonsCustomId.setExemptChannels)
    .setDisabled(disabled)
    .setLabel(t("automodExemptChannels", locale))
    .setStyle(ButtonStyle.Secondary);
}

export function getExemptRolesButton(locale: string, disabled = false) {
  return new ButtonBuilder()
    .setCustomId(automodButtonsCustomId.setExemptRoles)
    .setDisabled(disabled)
    .setLabel(t("automodExemptRoles", locale))
    .setStyle(ButtonStyle.Secondary);
}

export function getKeywordFilterButton(locale: string, disabled = false) {
  return new ButtonBuilder()
    .setCustomId(automodButtonsCustomId.setKeywordFilter)
    .setDisabled(disabled)
    .setLabel(t("automodKeywordFilter", locale))
    .setStyle(ButtonStyle.Secondary);
}

export function getKeywordPresetsButton(locale: string, disabled = false) {
  return new ButtonBuilder()
    .setCustomId(automodButtonsCustomId.setKeywordPresets)
    .setDisabled(disabled)
    .setLabel(t("automodKeywordPresets", locale))
    .setStyle(ButtonStyle.Secondary);
}

export function getMentionTotalLimitButton(locale: string, disabled = false) {
  return new ButtonBuilder()
    .setCustomId(automodButtonsCustomId.setMentionTotalLimit)
    .setDisabled(disabled)
    .setLabel(t("automodMentionTotalLimit", locale))
    .setStyle(ButtonStyle.Secondary);
}

export function getRegexPatternsButton(locale: string, disabled = false) {
  return new ButtonBuilder()
    .setCustomId(automodButtonsCustomId.setRegexPatterns)
    .setDisabled(disabled)
    .setLabel(t("automodRegexPatterns", locale))
    .setStyle(ButtonStyle.Secondary);
}

export function getToggleButton(locale: string, disabled = false) {
  return new ButtonBuilder()
    .setCustomId(JSON.stringify({ c, sc: "toggle", a: !disabled }))
    .setLabel(t(disabled ? "disabled" : "enabled", locale))
    .setStyle(disabled ? ButtonStyle.Danger : ButtonStyle.Success);
}

export function getTriggersButton(locale: string, disabled = false) {
  return new ButtonBuilder()
    .setCustomId(automodButtonsCustomId.setTriggerType)
    .setDisabled(disabled)
    .setLabel(t("automodTriggerType", locale))
    .setStyle(ButtonStyle.Primary);
}
