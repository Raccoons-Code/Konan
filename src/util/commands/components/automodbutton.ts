import { ButtonBuilder, ButtonStyle } from "discord.js";
import { t } from "../../../translator";

export function getSuccessButton() {
  return new ButtonBuilder()
    .setCustomId(JSON.stringify({
      c: "automod",
      sc: "success",
    }))
    .setDisabled(true)
    .setEmoji("✅")
    .setStyle(ButtonStyle.Success);
}

export function getCancelButton() {
  return new ButtonBuilder()
    .setCustomId(JSON.stringify({
      c: "automod",
      sc: "cancel",
    }))
    .setEmoji("✖️")
    .setStyle(ButtonStyle.Danger);
}

export function getAddActionButton(locale: string) {
  return new ButtonBuilder()
    .setCustomId(JSON.stringify({
      c: "automod",
      sc: "addAction",
    }))
    .setLabel(t("automodAddAction", locale))
    .setStyle(ButtonStyle.Secondary);
}

export function getToggleButton(locale: string, disabled = false) {
  return new ButtonBuilder()
    .setCustomId(JSON.stringify({
      c: "automod",
      sc: "toggle",
      a: disabled,
    }))
    .setLabel(t(disabled ? "disabled" : "activated", locale))
    .setStyle(disabled ? ButtonStyle.Danger : ButtonStyle.Success);
}

export function getRemActionButton(locale: string) {
  return new ButtonBuilder()
    .setCustomId(JSON.stringify({
      c: "automod",
      sc: "remAction",
    }))
    .setLabel(t("automodRemAction", locale))
    .setStyle(ButtonStyle.Secondary);
}

export function getEditNameButton(locale:string) {
  return new ButtonBuilder()
    .setCustomId(JSON.stringify({
      c: "automod",
      sc: "editName",
    }))
    .setLabel(t("automodEditName", locale))
    .setStyle(ButtonStyle.Secondary);
}

export function getEventsButton(locale: string) {
  return new ButtonBuilder()
    .setCustomId(JSON.stringify({
      c: "automod",
      sc: "setEventType",
    }))
    .setLabel(t("automodFieldEventType", locale))
    .setStyle(ButtonStyle.Secondary);
}

export function getExemptChannelsButton(locale: string) {
  return new ButtonBuilder()
    .setCustomId(JSON.stringify({
      c: "automod",
      sc: "setExemptChannels",
    }))
    .setLabel(t("automodFieldExemptChannels", locale))
    .setStyle(ButtonStyle.Secondary);
}

export function getExemptRolesButton(locale: string) {
  return new ButtonBuilder()
    .setCustomId(JSON.stringify({
      c: "automod",
      sc: "setExemptRoles",
    }))
    .setLabel(t("automodFieldExemptRoles", locale))
    .setStyle(ButtonStyle.Secondary);
}

export function getTriggersButton(locale: string) {
  return new ButtonBuilder()
    .setCustomId(JSON.stringify({
      c: "automod",
      sc: "setTriggerType",
    }))
    .setLabel(t("automodFieldTriggerType", locale))
    .setStyle(ButtonStyle.Secondary);
}
