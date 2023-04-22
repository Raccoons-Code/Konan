import { ButtonBuilder, ButtonStyle } from "discord.js";
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

export function getSuccessButton(disabled = false) {
  return new ButtonBuilder()
    .setCustomId(JSON.stringify({ c, sc: "success" }))
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
    .setStyle(ButtonStyle.Secondary);
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
    .setLabel(t("automodEditName", locale))
    .setStyle(ButtonStyle.Secondary);
}

export function getEventsButton(locale: string, disabled = false) {
  return new ButtonBuilder()
    .setCustomId(automodButtonsCustomId.setEventType)
    .setDisabled(disabled)
    .setLabel(t("automodEventType", locale))
    .setStyle(ButtonStyle.Secondary);
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
    .setCustomId(JSON.stringify({ c, sc: "toggle", a: disabled }))
    .setLabel(t(disabled ? "disabled" : "activated", locale))
    .setStyle(disabled ? ButtonStyle.Danger : ButtonStyle.Success);
}

export function getTriggersButton(locale: string, disabled = false) {
  return new ButtonBuilder()
    .setCustomId(automodButtonsCustomId.setTriggerType)
    .setDisabled(disabled)
    .setLabel(t("automodTriggerType", locale))
    .setStyle(ButtonStyle.Secondary);
}
