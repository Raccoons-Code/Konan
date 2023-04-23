import { APIEmbedField, Embed } from "discord.js";
import { t } from "../../../translator";
import { getActionTypes } from "../../automod";

export const configEmbedFields = [[{
  name: "automodTriggerType",
  value: " ",
}, {
  name: "automodEventType",
  value: " ",
}, {
  name: "automodExemptChannels",
  value: " ",
}, {
  name: "automodExemptRoles",
  value: " ",
}, {
  name: "automodAllowList",
  value: " ",
}, {
  name: "automodKeywordFilter",
  value: " ",
}, {
  name: "automodMentionTotalLimit",
  value: " ",
}, {
  name: "automodKeywordPresets",
  value: " ",
}, {
  name: "automodRegexPatterns",
  value: " ",
}], [{
  name: "BlockMessage",
  value: " ",
}, {
  name: "SendAlertMessage",
  value: " ",
}, {
  name: "Timeout",
  value: " ",
}]];

export function embedsHasRequiredFieldsByTrigger(
  embeds: Embed[],
  locale: string,
) {
  const [title, trigger, event, ...fields] = getRequiredFields(embeds);

  if (!title || title.value === " ") return false;
  if (!trigger || trigger.value === " ") return false;
  if (!event || event.value === " ") return false;
  if (!fields?.length) return false;

  const [bit] = trigger.value.split(" - ");

  const actionTypes = RegExp(`(${getActionTypes(+bit)
    .flatMap(type => [
      `ON - ${t(type)}`,
      `ON - ${t(type, locale)}`,
    ]).join("|")})`, "i");

  return fields.some(field => actionTypes.test(field.name));
}

export function getRequiredFields(
  embeds: Embed[],
) {
  const fields: APIEmbedField[] = [];

  const [embed] = embeds;

  fields.push({
    name: "name",
    value: embed.data.title ?? " ",
  });

  for (const embed of embeds) {
    if (!embed.data?.fields?.length) continue;

    for (const field of embed.data.fields) {
      if (/(^ON - |\*)/.test(field.name)) {
        fields.push(field);
      }
    }
  }

  return fields;
}
