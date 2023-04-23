import { APIEmbedField, AutoModerationActionMetadataOptions, AutoModerationActionOptions, AutoModerationActionType, AutoModerationRuleCreateOptions, AutoModerationRuleTriggerType, AutoModerationTriggerMetadataOptions, Embed } from "discord.js";
import { t } from "../../../translator";
import ParseMs from "../../ParseMs";
import { automodMetadataByTrigger, getActionTypes, getRequiredMetadataByTrigger } from "../../automod";

export const configEmbedFields = [[{
  name: "automodTriggerType",
  value: " ",
  key: "triggerType",
  index: 0,
}, {
  name: "automodEventType",
  value: " ",
  key: "eventType",
  index: 1,
}, {
  name: "automodExemptChannels",
  value: " ",
  key: "exemptChannels",
  index: 2,
}, {
  name: "automodExemptRoles",
  value: " ",
  key: "exemptRoles",
  index: 3,
}, {
  name: "automodAllowList",
  value: " ",
  key: "allowList",
  index: 4,
}, {
  name: "automodKeywordFilter",
  value: " ",
  key: "keywordFilter",
  index: 5,
}, {
  name: "automodMentionTotalLimit",
  value: " ",
  key: "mentionTotalLimit",
  index: 6,
}, {
  name: "automodKeywordPresets",
  value: " ",
  key: "presets",
  index: 7,
}, {
  name: "automodRegexPatterns",
  value: " ",
  key: "regexPatterns",
  index: 8,
}], [{
  name: "BlockMessage",
  value: " ",
  key: "customMessage",
  index: 0,
  type: AutoModerationActionType.BlockMessage,
}, {
  name: "SendAlertMessage",
  value: " ",
  key: "channel",
  index: 1,
  type: AutoModerationActionType.SendAlertMessage,
}, {
  name: "Timeout",
  value: " ",
  key: "durationSeconds",
  index: 2,
  type: AutoModerationActionType.Timeout,
}]];

/* const idFields = [
  "exemptChannels",
  "exemptRoles",
]; */

const allowedTimeoutActionByTrigger = [
  AutoModerationRuleTriggerType.Keyword,
  AutoModerationRuleTriggerType.MentionSpam,
];

export function getEmbedFieldsValues(embeds: Embed[]) {
  const config = <Record<string, string>>{};

  for (let i = 0; i < embeds.length; i++) {
    const fields = embeds[i].data.fields ?? embeds[i].fields;

    for (let j = 0; j < fields.length; j++) {
      config[configEmbedFields[i][j].name] = fields[j].name;
      config[configEmbedFields[i][j].key] = fields[j].value;
    }
  }

  const triggerType = +config.triggerType.split(" - ")[0];

  const actions: AutoModerationActionOptions[] = [];

  for (const field of configEmbedFields[1]) {
    if (/^ON - /.test(config[field.name]) && "type" in field) {
      const metadata = <AutoModerationActionMetadataOptions>{};

      switch (field.key) {
        case "customMessage":
          if (config.customMessage !== " ") {
            metadata.customMessage = config.customMessage;
          } else {
            metadata.customMessage = null;
          }

          actions.push({
            type: field.type,
            metadata,
          });
          break;

        case "channel":
          if (config.channel !== " ")
            metadata.channel = `${config.channel.match(/(\d{17,})/)?.[1]}`;

          actions.push({
            type: field.type,
            metadata,
          });
          break;

        case "durationSeconds":
          if (allowedTimeoutActionByTrigger.includes(triggerType)) {
            if (config.durationSeconds !== " ") {
              metadata.durationSeconds = new ParseMs(config.durationSeconds).result as number;
            } else {
              metadata.durationSeconds = null;
            }

            actions.push({
              type: field.type,
              metadata,
            });
          }
          break;
      }
    }
  }

  const eventType = +config.eventType.split(" - ")[0];

  const exemptChannels = <string[]>config.exemptChannels.match(/(\d{17,})/g) ?? [];
  const exemptRoles = <string[]>config.exemptRoles.match(/(\d{17,})/g) ?? [];

  const configValues: Record<string, any> = {
    allowList: config.allowList.split(/[,\r\n]+/)
      .filter(v => v),
    keywordFilter: config.keywordFilter.split(/[,\r\n]+/)
      .filter(v => v),
    mentionTotalLimit: +config.mentionTotalLimit,
    presets: config.presets.split(/[\r\n]+/)
      .flatMap(preset => +preset.split(" - ")[0]),
    regexPatterns: config.regexPatterns.split(/[\r\n]+/)
      .filter(v => v),
  };

  const triggerMetadata = <AutoModerationTriggerMetadataOptions>{};
  for (const key of automodMetadataByTrigger[<AutoModerationRuleTriggerType>triggerType]) {
    triggerMetadata[<keyof AutoModerationTriggerMetadataOptions>key] = configValues[key];
  }

  return <Omit<AutoModerationRuleCreateOptions, "name" | "enabled" | "reason">>{
    actions,
    eventType,
    triggerType,
    exemptChannels,
    exemptRoles,
    triggerMetadata,
  };
}

export function embedsHasRequiredFieldsByTrigger(
  embeds: Embed[],
  locale: string,
) {
  const [embed] = embeds;

  const config = <Record<string, APIEmbedField>>{};

  for (let i = 0; i < embeds.length; i++) {
    const fields = embeds[i].data.fields ?? embeds[i].fields;

    for (let j = 0; j < fields.length; j++) {
      config[configEmbedFields[i][j].key] = fields[j];
    }
  }

  config.name = {
    name: "name",
    value: embed.data?.title ?? embed.title ?? "",
  };

  const triggerType = +config.triggerType?.value.split(" - ")[0];

  if (!config.name.value) return false;
  if (!triggerType) return false;
  if (!config.eventType?.value || config.eventType.value === " ") return false;

  const metadataKeys = getRequiredMetadataByTrigger(triggerType);

  const actionTypes = RegExp(`(${getActionTypes(+triggerType)
    .flatMap(type => [
      `ON - ${t(type)}`,
      `ON - ${t(type, locale)}`,
    ]).join("|")})`, "i");

  return Object.values(config).some(field => actionTypes.test(field.name)) &&
    metadataKeys.some(key => config[key].value && config[key].value !== " ");
}

export function getRequiredFields(
  embeds: Embed[],
) {
  const fields: APIEmbedField[] = [];

  const [embed] = embeds;

  fields.push({
    name: "name",
    value: embed.data?.title ?? embed.title ?? " ",
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
