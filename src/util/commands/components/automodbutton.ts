import { ButtonBuilder, ButtonStyle } from "discord.js";
import { t } from "../../../translator";

export function getTriggersButton(locale: string) {
  return new ButtonBuilder()
    .setCustomId(JSON.stringify({
      c: "automod",
      sc: "setTriggerType",
    }))
    .setLabel(t("automodFieldTriggerType", locale))
    .setStyle(ButtonStyle.Primary);
}
