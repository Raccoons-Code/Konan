import { APIEmbed, APIEmbedField, AutoModerationAction, AutoModerationActionMetadata, AutoModerationActionMetadataOptions, AutoModerationActionOptions, AutoModerationActionType, AutoModerationRule, AutoModerationRuleCreateOptions, AutoModerationRuleEventType, AutoModerationRuleKeywordPresetType, AutoModerationRuleTriggerType, AutoModerationTriggerMetadataOptions, Collection, Embed } from "discord.js";
import ms from "ms";
import { t } from "../../../translator";
import ParseMs from "../../ParseMs";
import { automodMetadataByTrigger, getActionTypes, getRequiredMetadataByTrigger } from "../../automod";

export const configEmbedFields: {
  name: string
  value: string
  key: string
  index: number
  parent?: string
  type?: any
  convert: (v: string) => any
  convertToEmbed: (v: any, l: string) => string
}[][] = [[{
  name: "automodTriggerType",
  value: " ",
  key: "triggerType",
  index: 0,
  convert: (v: string) => +v.split(" - ")[0],
  convertToEmbed: (v: AutoModerationRuleTriggerType, l: string) =>
    `${v} - ${t(AutoModerationRuleTriggerType[v], l)}`,
}, {
  name: "automodEventType",
  value: " ",
  key: "eventType",
  index: 1,
  convert: (v: string) => +v.split(" - ")[0],
  convertToEmbed: (v: AutoModerationRuleEventType, l: string) =>
    `${v} - ${t(AutoModerationRuleEventType[v], l)}`,
}, {
  name: "automodExemptChannels",
  value: " ",
  key: "exemptChannels",
  index: 2,
  convert: (v: string) => v.match(/\d{17,}/g) ?? [],
  convertToEmbed: <T>(v: Collection<string, T>) => v.toJSON().join(" "),
}, {
  name: "automodExemptRoles",
  value: " ",
  key: "exemptRoles",
  index: 3,
  convert: (v: string) => v.match(/\d{17,}/g) ?? [],
  convertToEmbed: <T>(v: Collection<string, T>) => v.toJSON().join(" "),
}, {
  name: "automodAllowList",
  value: " ",
  key: "allowList",
  parent: "triggerMetadata",
  index: 4,
  convert: (v: string) => v.split(/[,\r\n]+/),
  convertToEmbed: <T>(v: T[]) => v.join(","),
}, {
  name: "automodKeywordFilter",
  value: " ",
  key: "keywordFilter",
  parent: "triggerMetadata",
  index: 5,
  convert: (v: string) => v.split(/[,\r\n]+/),
  convertToEmbed: <T>(v: T[]) => v.join(","),
}, {
  name: "automodKeywordPresets",
  value: " ",
  key: "presets",
  parent: "triggerMetadata",
  index: 6,
  convert: (v: string) => v.split("\n").map(a => +a.split(" - ")[0]),
  convertToEmbed: (presets: AutoModerationRuleKeywordPresetType[], l: string) =>
    presets.map(preset => `${preset} - ${t(AutoModerationRuleKeywordPresetType[preset], l)}`)
      .join("\n"),
}, {
  name: "automodMentionTotalLimit",
  value: " ",
  key: "mentionTotalLimit",
  parent: "triggerMetadata",
  index: 7,
  convert: (v: string) => +v,
  convertToEmbed: (v: number) => `${v}`,
}, {
  name: "automodRegexPatterns",
  value: " ",
  key: "regexPatterns",
  parent: "triggerMetadata",
  index: 8,
  convert: (v: string) => v.split(/[\r\n]+/),
  convertToEmbed: <T>(v: T[]) => v.join("\n"),
}], [{
  name: "BlockMessage",
  value: " ",
  key: "customMessage",
  parent: "actions",
  index: 0,
  type: AutoModerationActionType.BlockMessage,
  convert: (v: string) => v,
  convertToEmbed: (v: string) => v,
}, {
  name: "SendAlertMessage",
  value: " ",
  key: "channel",
  parent: "actions",
  index: 1,
  type: AutoModerationActionType.SendAlertMessage,
  convert: (v: string) => v.match(/\d{17,}/)?.[1] ?? "",
  convertToEmbed: (v: string) => `${v}`,
}, {
  name: "Timeout",
  value: " ",
  key: "durationSeconds",
  parent: "actions",
  index: 2,
  type: AutoModerationActionType.Timeout,
  convert: (v: string) => ms(v) / 1000,
  convertToEmbed: (v: number) => `${ms(v * 1000)}`,
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
    if (!("type" in field)) continue;

    if (/^ON - /.test(config[field.name])) {
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
              metadata.durationSeconds = (<number>new ParseMs(config.durationSeconds).result) / ParseMs.s;
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
    metadataKeys.length ?
    metadataKeys.some(key => config[key].value && config[key].value !== " ") :
    true;
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

export function getEmbedFieldsFromRule(rule: AutoModerationRule, locale: string) {
  const embeds: APIEmbed[] = [];

  {
    const fields: APIEmbedField[] = [];

    for (const field of configEmbedFields[0]) {
      let value: any;

      if (field.parent)
        value = rule[<keyof AutoModerationRule>field.parent];

      value = (value ?? rule)[<keyof AutoModerationRule>field.key];

      if (value) {
        value = field.convertToEmbed(value, locale);
      } else {
        value = field.value;
      }

      fields.push({
        name: t(field.name, locale),
        value,
      });
    }

    const embed = {
      title: rule.name,
      fields,
    };

    embeds.push(embed);
  }

  {
    const fields: APIEmbedField[] = [];

    for (const field of configEmbedFields[1]) {
      const action = <AutoModerationAction | undefined>rule.actions
        .find(action => action.type === field.type);

      let value = action?.metadata[<keyof AutoModerationActionMetadata>field.key];
      if (value) {
        value = field.convertToEmbed(value, locale);
      } else {
        value = field.value;
      }

      fields.push({
        name: t(field.name, locale),
        value,
      });
    }

    const embed = {
      title: t("automodActions", locale),
      fields,
    };

    embeds.push(embed);
  }

  return embeds;
}
