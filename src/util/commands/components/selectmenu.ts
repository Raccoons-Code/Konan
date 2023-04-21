import { ActionRow, ActionRowBuilder, APIActionRowComponent, APIActionRowComponentTypes, APISelectMenuOption, APIStringSelectComponent, ComponentEmojiResolvable, ComponentType, JSONEncodable, MessageActionRowComponent, SelectMenuComponentOptionData, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { BaseComponentCustomId, SelectRolesOptionValue } from "../../../@types";
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
  menuOptions?: {
    placeholder: string | string[]
  },
) {
  let index = 0;

  return splitArrayInGroups(options, 25)
    .map(group => new ActionRowBuilder<StringSelectMenuBuilder>()
      .addComponents(new StringSelectMenuBuilder()
        .setPlaceholder(
          Array.isArray(menuOptions?.placeholder) ?
            menuOptions?.placeholder[index] ?? "" :
            menuOptions?.placeholder ?? "",
        )
        .setCustomId(JSON.stringify({
          d: Date.now() + index++,
          ...customId,
        }))
        .setOptions(group)
        .setMaxValues(group.length)));
}

export function getDefaultOptionFromSelect(
  components: JSONEncodable<APIActionRowComponent<APIActionRowComponentTypes>>[],
) {
  let optionDefault: APISelectMenuOption | undefined;

  components?.some(row =>
    row.toJSON().components.some(element =>
      element.type === ComponentType.StringSelect &&
      element.options.some(option =>
        option.default && (optionDefault = option))));

  return optionDefault;
}

export function removeOptionsFromSelectMenu(
  components: ActionRow<MessageActionRowComponent>[] = [],
  menuId: string,
  optionIds: string | string[],
) {
  if (!components?.length) return [];
  if (!optionIds) return components;
  if (!Array.isArray(optionIds)) optionIds = [optionIds];

  return components.reduce<(
    | ActionRow<MessageActionRowComponent>
    | ActionRowBuilder<StringSelectMenuBuilder>
  )[]>((acc, row) => {
    const rowJson = <APIActionRowComponent<APIStringSelectComponent>>row.toJSON();

    if (!rowJson.components.length) return acc;

    if (rowJson.components[0].type !== ComponentType.StringSelect) return acc.concat(row);

    const menus = rowJson.components.reduce<StringSelectMenuBuilder[]>((acc2, select) => {
      if (menuId && select.custom_id !== menuId)
        return acc2.concat(new StringSelectMenuBuilder(select));

      select.options = select.options.filter(option => {
        const optionId = <SelectRolesOptionValue>JSON.parse(option.value);

        return !(
          optionIds.includes(optionId.id ?? option.value) ||
          optionIds.includes(option.value)
        );
      });

      if (!select.options.length) return acc2;

      return acc2.concat(new StringSelectMenuBuilder(select));
    }, []);

    if (!menus.length) return acc;

    return acc.concat(new ActionRowBuilder<StringSelectMenuBuilder>()
      .addComponents(menus));
  }, []);
}

export function removeSelectMenuByCustomId(
  components: ActionRow<MessageActionRowComponent>[],
  customId: string | string[],
) {
  if (!Array.isArray(customId)) customId = [customId];

  return components.reduce<ActionRow<MessageActionRowComponent>[]>((acc, row) => {
    const rowJson = row.toJSON();

    if (rowJson.components[0].type !== ComponentType.StringSelect)
      return acc.concat(row);

    if (customId.includes(rowJson.components[0].custom_id)) return acc;

    return acc.concat(row);
  }, []);
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
            const parsedValue = JSONparse(option.value) ?? {};

            return new StringSelectMenuOptionBuilder(option)
              .setEmoji(values.includes(option.value) ? parsedValue.v ?
                Danger : Success : option.emoji ?? {})
              .setValue(JSON.stringify({
                ...parsedValue,
                v: values.includes(option.value) ? parsedValue.v ? 0 : 1 : parsedValue.v,
              }));
          }));
      }));
  });
}

export interface EmojisData {
  Success?: ComponentEmojiResolvable;
  Danger?: ComponentEmojiResolvable;
}

export function setSelectMenuOptions(
  components: ActionRow<MessageActionRowComponent>[],
  customId: string,
  options: StringSelectMenuOptionBuilder[],
) {
  if (!components.length) return [];
  if (!customId) return components;

  return components.map(row => {
    const rowJson = <APIActionRowComponent<APIStringSelectComponent>>row.toJSON();

    if (rowJson.components[0].type !== ComponentType.StringSelect) return row;
    if (rowJson.components[0].custom_id !== customId) return row;

    return new ActionRowBuilder<StringSelectMenuBuilder>()
      .addComponents(rowJson.components.map(select => new StringSelectMenuBuilder({
        custom_id: select.custom_id,
        disabled: select.disabled,
        max_values: select.max_values,
        min_values: select.min_values,
        placeholder: select.placeholder,
      })
        .addOptions(options)));
  });
}
