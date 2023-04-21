import { ButtonBuilder, ButtonStyle } from "discord.js";
import { t } from "../../../translator";

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
