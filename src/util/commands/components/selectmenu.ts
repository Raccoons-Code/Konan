import { ActionRow, ActionRowBuilder, APIActionRowComponent, APIActionRowComponentTypes, APISelectMenuOption, APIStringSelectComponent, ChannelSelectMenuBuilder, ComponentEmojiResolvable, ComponentType, JSONEncodable, MessageActionRowComponent, MessageActionRowComponentBuilder, RoleSelectMenuBuilder, SelectMenuComponentOptionData, SelectMenuType, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { SelectRolesOptionValue } from "../../../@types";
import { t } from "../../../translator";
import { GUILD_CHANNEL_TYPES } from "../../constants";
import ParseMs from "../../ParseMs";
import { JSONparse, splitArrayInGroups } from "../../utils";

export interface CreateMenuOptions {
  /**
   * @default 25
   */
  maxOptions: number
  placeholder: string | string[]
  /**
   * @default true
   */
  distinct: boolean
}

export function getChannelSelect(
  customId: string,
  menuOptions: Partial<CreateMenuOptions> = {},
) {
  return new ChannelSelectMenuBuilder()
    .setCustomId(customId)
    .setChannelTypes(...GUILD_CHANNEL_TYPES)
    .setMinValues(0)
    .setMaxValues(menuOptions.maxOptions ?? 25);
}

export function getRoleSelect(
  customId: string,
  menuOptions: Partial<CreateMenuOptions> = {},
) {
  return new RoleSelectMenuBuilder()
    .setCustomId(customId)
    .setMinValues(0)
    .setMaxValues(menuOptions.maxOptions ?? 25);
}

export function addSelectMenuByType(
  type: Exclude<SelectMenuType, ComponentType.StringSelect>,
  customId: string,
  components?: (
    | ActionRow<MessageActionRowComponent>
    | ActionRowBuilder<MessageActionRowComponentBuilder>
  )[],
  menuOptions: Partial<CreateMenuOptions> = {},
) {
  if (!components) components = [];

  if (menuOptions.distinct ?? true) {
    const parsedId = JSON.parse(customId);
    parsedId.d = Date.now();
    customId = JSON.stringify(parsedId);
  }

  const component = new ActionRowBuilder<any>();

  switch (type) {
    case ComponentType.ChannelSelect:
      component.addComponents(getChannelSelect(customId, menuOptions));
      break;

    case ComponentType.RoleSelect:
      component.addComponents(getRoleSelect(customId, menuOptions));
      break;
  }

  return components.concat(component);
}

export function addSelectOptionsToRows(
  components: (ActionRow<MessageActionRowComponent> | ActionRowBuilder<StringSelectMenuBuilder>)[],
  selectId: string,
  options: (APISelectMenuOption | StringSelectMenuOptionBuilder | SelectMenuComponentOptionData)[],
  menuOptions: Partial<CreateMenuOptions> = {},
) {
  if (!components) components = [];
  menuOptions = {
    maxOptions: menuOptions.maxOptions ?? 25,
    placeholder: menuOptions.placeholder,
    distinct: menuOptions.distinct,
  };

  return components.map(row => {
    const rowJson = <APIActionRowComponent<APIStringSelectComponent>>row.toJSON();

    if (!rowJson.components.length) return row;

    if (rowJson.components[0].type !== ComponentType.StringSelect) return row;

    if (rowJson.components.every(select => select.custom_id !== selectId)) return row;

    return new ActionRowBuilder<StringSelectMenuBuilder>()
      .addComponents(rowJson.components.map(select => {
        const newOptions = options.splice(0, 25 - select.options.length);

        const optionsSize = newOptions.length + select.options.length;

        return new StringSelectMenuBuilder(select)
          .addOptions(newOptions)
          .setMaxValues(optionsSize > menuOptions.maxOptions! ?
            menuOptions.maxOptions! : optionsSize);
      }));
  })
    .concat(createSelectFromOptions(options, selectId, menuOptions));
}

export function createSelectFromOptions(
  options: (
    | APISelectMenuOption
    | SelectMenuComponentOptionData
    | StringSelectMenuOptionBuilder
  )[],
  customId: string,
  menuOptions: Partial<CreateMenuOptions> = {},
) {
  menuOptions = {
    maxOptions: menuOptions.maxOptions ?? 25,
    placeholder: menuOptions.placeholder,
    distinct: menuOptions.distinct ?? true,
  };

  let index = 0;

  return splitArrayInGroups(options, 25)
    .map(group => new ActionRowBuilder<StringSelectMenuBuilder>()
      .addComponents(new StringSelectMenuBuilder()
        .setPlaceholder(
          Array.isArray(menuOptions.placeholder) ?
            menuOptions.placeholder[index] ?? "" :
            menuOptions.placeholder ?? "",
        )
        .setCustomId(
          menuOptions.distinct ?
            JSON.stringify({
              ...JSON.parse(customId),
              d: Date.now() + index++,
            }) :
            customId,
        )
        .setOptions(group)
        .setMaxValues(group.length > menuOptions.maxOptions! ?
          menuOptions.maxOptions! : group.length)));
}

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

export function removeSelectMenuById(
  components: ActionRow<MessageActionRowComponent>[],
  customId: string | string[],
) {
  if (!Array.isArray(customId)) customId = [customId];

  return components.reduce<ActionRow<MessageActionRowComponent>[]>((acc, row) => {
    const rowJson = row.toJSON();

    if (rowJson.components[0].type === ComponentType.Button)
      return acc.concat(row);

    if (customId.includes(rowJson.components[0].custom_id)) return acc;

    return acc.concat(row);
  }, []);
}

export function removeSelectByType(
  components: (
    | ActionRow<MessageActionRowComponent>
    | ActionRowBuilder<MessageActionRowComponentBuilder>
  )[],
  type: Exclude<SelectMenuType, ComponentType.StringSelect>,
) {
  return components.filter(row => {
    const rowJson = row.toJSON();

    return rowJson.components.some(element => element.type !== type);
  });
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

export function setDefaultOptionByValue(
  components: (ActionRow<MessageActionRowComponent> | ActionRowBuilder<StringSelectMenuBuilder>)[],
  customId: string,
  defaultValue: string,
) {
  return components.map(row => {
    const rowJson = <APIActionRowComponent<APIStringSelectComponent>>row.toJSON();

    if (rowJson.components[0].type !== ComponentType.StringSelect) return row;
    if (rowJson.components[0].custom_id !== customId) return row;

    return new ActionRowBuilder<StringSelectMenuBuilder>()
      .addComponents(rowJson.components.map(element => {
        const selectMenu = new StringSelectMenuBuilder(element);

        return selectMenu.setOptions(element.options
          .map(option => new StringSelectMenuOptionBuilder(option)
            .setDefault(defaultValue === option.value)));
      }));
  });
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

export function getTimesSelectOptions(locale: string) {
  return [
    new StringSelectMenuOptionBuilder()
      .setLabel(t("NSeconds", { locale, n: 60 }))
      .setValue(JSON.stringify({
        ms: ParseMs.m,
        s: 60,
        m: 1,
      })),
    new StringSelectMenuOptionBuilder()
      .setLabel(t("NMinutes", { locale, n: 5 }))
      .setValue(JSON.stringify({
        ms: ParseMs.m * 5,
        s: 60 * 5,
        m: 5,
      })),
    new StringSelectMenuOptionBuilder()
      .setLabel(t("NMinutes", { locale, n: 10 }))
      .setValue(JSON.stringify({
        ms: ParseMs.m * 10,
        s: 60 * 10,
        m: 10,
      })),
    new StringSelectMenuOptionBuilder()
      .setLabel(t("NMinutes", { locale, n: 20 }))
      .setValue(JSON.stringify({
        ms: ParseMs.m * 20,
        s: 60 * 20,
        m: 20,
      })),
    new StringSelectMenuOptionBuilder()
      .setLabel(t("NMinutes", { locale, n: 30 }))
      .setValue(JSON.stringify({
        ms: ParseMs.m * 30,
        s: 60 * 30,
        m: 30,
      })),
    new StringSelectMenuOptionBuilder()
      .setLabel(t("NMinutes", { locale, n: 60 }))
      .setValue(JSON.stringify({
        ms: ParseMs.h,
        s: 60 * 60,
        m: 60,
        h: 1,
      })),
    new StringSelectMenuOptionBuilder()
      .setLabel(t("NHours", { locale, n: 6 }))
      .setValue(JSON.stringify({
        ms: ParseMs.h * 6,
        s: 60 * 60 * 6,
        m: 60 * 6,
        h: 6,
      })),
    new StringSelectMenuOptionBuilder()
      .setLabel(t("NHours", { locale, n: 12 }))
      .setValue(JSON.stringify({
        ms: ParseMs.h * 12,
        s: 60 * 60 * 12,
        m: 60 * 12,
        h: 12,
      })),
    new StringSelectMenuOptionBuilder()
      .setLabel(t("NHours", { locale, n: 18 }))
      .setValue(JSON.stringify({
        ms: ParseMs.h * 18,
        s: 60 * 60 * 18,
        m: 60 * 18,
        h: 18,
      })),
    new StringSelectMenuOptionBuilder()
      .setLabel(t("NHours", { locale, n: 24 }))
      .setValue(JSON.stringify({
        ms: ParseMs.D,
        s: 60 * 60 * 24,
        m: 60 * 24,
        h: 24,
        d: 1,
      })),
    new StringSelectMenuOptionBuilder()
      .setLabel(t("NDays", { locale, n: 7 }))
      .setValue(JSON.stringify({
        ms: ParseMs.S,
        s: 60 * 60 * 24 * 7,
        m: 60 * 24 * 7,
        h: 24 * 7,
        d: 7,
        w: 1,
      })),
    new StringSelectMenuOptionBuilder()
      .setLabel(t("NWeeks", { locale, n: 2 }))
      .setValue(JSON.stringify({
        ms: ParseMs.S * 2,
        s: 60 * 60 * 24 * 7 * 2,
        m: 60 * 24 * 7 * 2,
        h: 24 * 7 * 2,
        d: 7 * 2,
        w: 2,
      })),
    new StringSelectMenuOptionBuilder()
      .setLabel(t("NWeeks", { locale, n: 3 }))
      .setValue(JSON.stringify({
        ms: ParseMs.S * 3,
        s: 60 * 60 * 24 * 7 * 3,
        m: 60 * 24 * 7 * 3,
        h: 24 * 7 * 3,
        d: 7 * 3,
        w: 3,
      })),
    new StringSelectMenuOptionBuilder()
      .setLabel(t("NWeeks", { locale, n: 4 }))
      .setValue(JSON.stringify({
        ms: ParseMs.S * 4,
        s: 60 * 60 * 24 * 7 * 4,
        m: 60 * 24 * 7 * 4,
        h: 24 * 7 * 4,
        d: 7 * 4,
        w: 4,
      })),
  ];
}
