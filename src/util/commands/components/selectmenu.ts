import { ActionRow, ActionRowBuilder, APIActionRowComponent, APISelectMenuOption, APIStringSelectComponent, ComponentEmojiResolvable, ComponentType, MessageActionRowComponent, MessageActionRowComponentBuilder, SelectMenuComponentOptionData, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { BaseComponentCustomId } from "../../../@types";
import { JSONparse, splitArrayInGroups } from "../../utils";

export function calculateBitFieldFromSelectMenus(
  components: (ActionRow<MessageActionRowComponent> | ActionRowBuilder<StringSelectMenuBuilder>)[],
) {
  return components.reduce((acc, row) => {
    const rowJson = <APIActionRowComponent<APIStringSelectComponent>>row.toJSON();

    if (rowJson.components[0].type !== ComponentType.StringSelect) return acc;

    return acc + rowJson.components.reduce((acc2, element) => {
      return acc2 + element.options.reduce((acc3, option) => {
        const value = JSONparse(option.value);

        if (value?.v) return acc3 | BigInt(value.n);

        return acc3;
      }, 0n);
    }, 0n);
  }, 0n);
}

export function createSelectMenuFromOptions(
  options: (APISelectMenuOption | SelectMenuComponentOptionData | StringSelectMenuOptionBuilder)[],
  customId: BaseComponentCustomId,
) {
  let index = 0;

  return splitArrayInGroups(options, 25)
    .map(group => new ActionRowBuilder<StringSelectMenuBuilder>()
      .addComponents(new StringSelectMenuBuilder()
        .setCustomId(JSON.stringify({
          d: Date.now() + index++,
          ...customId,
        }))
        .setOptions(group)
        .setMaxValues(group.length)));
}

export function getDefaultOptionFromSelect(
  components: (
    | ActionRow<MessageActionRowComponent>
    | ActionRowBuilder<MessageActionRowComponentBuilder>
  )[],
) {
  let optionDefault: APISelectMenuOption | undefined;

  components?.some(row =>
    row.toJSON().components.some(element =>
      element.type === ComponentType.StringSelect &&
      element.options.some(option =>
        option.default && (optionDefault = option))));

  return optionDefault;
}

export function setBitFieldValuesOnSelectMenus(
  components: ActionRow<MessageActionRowComponent>[],
  values: string[],
  customId: string,
  emojis: EmojisData = { Success: "✅", Danger: "❌" },
) {
  const { Danger = {}, Success = {} } = emojis;

  return components.map(row => {
    const rowJson = <APIActionRowComponent<APIStringSelectComponent>>row.toJSON();

    if (rowJson.components[0].type !== ComponentType.StringSelect) return row;

    return new ActionRowBuilder<StringSelectMenuBuilder>()
      .addComponents(rowJson.components.map(select => {
        if (select.custom_id !== customId)
          return new StringSelectMenuBuilder(select);

        return new StringSelectMenuBuilder({
          custom_id: select.custom_id,
          disabled: select.disabled,
          max_values: select.max_values,
          min_values: select.min_values,
          placeholder: select.placeholder,
          type: select.type,
        })
          .setOptions(select.options.map(option => {
            const value = JSONparse(option.value) ?? {};

            return new StringSelectMenuOptionBuilder(option)
              .setEmoji(values.includes(option.value) ? value.v ?
                Danger : Success : option.emoji ?? {})
              .setValue(JSON.stringify({
                ...value,
                v: values.includes(option.value) ? value.v ? 0 : 1 : value.v,
              }));
          }));
      }));
  });
}

export interface EmojisData {
  Success?: ComponentEmojiResolvable;
  Danger?: ComponentEmojiResolvable;
}
