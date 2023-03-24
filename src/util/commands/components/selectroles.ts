import { ActionRow, ActionRowBuilder, APIActionRowComponent, APIRole, APISelectMenuOption, APIStringSelectComponent, ComponentType, MessageActionRowComponent, Role, SelectMenuComponentOptionData, Snowflake, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { BaseComponentCustomId, ManageSelectRolesOptions, SelectRolesCustomId, SelectRolesOptionValue } from "../../../@types";
import regexp from "../../regexp";
import { JSONparse, splitArrayInGroups } from "../../utils";

export function addSelectByRoles(
  options: ManageSelectRolesOptions,
  components?: (
    | ActionRow<MessageActionRowComponent>
    | ActionRowBuilder<StringSelectMenuBuilder>
  )[],
) {
  if (!components) components = [];
  if (!options) return components;
  if (!options.roles?.length) return components;

  components = components
    .filter(component => component)
    .map(row => {
      const rowJson = <APIActionRowComponent<APIStringSelectComponent>>row.toJSON();

      if (rowJson.components[0].type !== ComponentType.StringSelect) return row;
      if (rowJson.components[0].options.length === 25) return row;

      return new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(rowJson.components.map(select => {
          const roles = options.roles.splice(0, 25 - select.options.length);

          return new StringSelectMenuBuilder(select)
            .addOptions(roles.map(role => new StringSelectMenuOptionBuilder()
              .setDefault(role.id === options.defaultRole?.id)
              .setLabel(`${role.name.slice(0, 83)} 0`)
              .setValue(JSON.stringify({
                count: 0,
                id: role.id,
              }))))
            .setMaxValues(roles.length + select.options.length)
            .setPlaceholder(options.menuPlaceholder ?? select.placeholder ?? "");
        }));
    });

  return components.concat(createSelectByRoles(options));
}

export function addSelectOptionsToRows(
  components: (ActionRow<MessageActionRowComponent> | ActionRowBuilder<StringSelectMenuBuilder>)[],
  selectId: string,
  options: (APISelectMenuOption | StringSelectMenuOptionBuilder | SelectMenuComponentOptionData)[],
) {
  if (!components) components = [];

  components = components.map(row => {
    const rowJson = <APIActionRowComponent<APIStringSelectComponent>>row.toJSON();

    if (!rowJson.components.length) return row;

    if (rowJson.components[0].type !== ComponentType.StringSelect) return row;

    if (rowJson.components.every(select => select.custom_id !== selectId)) return row;

    return new ActionRowBuilder<StringSelectMenuBuilder>()
      .addComponents(rowJson.components.map(select => {
        const newOptions = options.splice(0, 25 - select.options.length);

        return new StringSelectMenuBuilder(select)
          .addOptions(newOptions)
          .setMaxValues(newOptions.length + select.options.length);
      }));
  });

  return components.concat(createSelectFromOptions(options, JSON.parse(selectId)));
}

export function createSelectByRoles(options: ManageSelectRolesOptions) {
  let index = 0;

  return splitArrayInGroups(options.roles, 25)
    .map(group => new ActionRowBuilder<StringSelectMenuBuilder>()
      .addComponents(new StringSelectMenuBuilder()
        .setCustomId(JSON.stringify({
          c: "selectroles",
          count: 0,
          d: Date.now() + index++,
        }))
        .setMaxValues(group.length)
        .setOptions(group.map(role => new StringSelectMenuOptionBuilder()
          .setDefault(role.id === options.defaultRole?.id)
          .setLabel(`${role.name.slice(0, 83)} 0`)
          .setValue(JSON.stringify({
            count: 0,
            id: role.id,
          }))))
        .setPlaceholder(options.menuPlaceholder ?? "")));
}

export function createSelectFromOptions(
  options: (APISelectMenuOption | StringSelectMenuOptionBuilder | SelectMenuComponentOptionData)[],
  customId: BaseComponentCustomId,
) {
  if (typeof customId === "string")
    customId = <BaseComponentCustomId>JSON.parse(customId);

  let index = 0;

  return splitArrayInGroups(options, 25).map(group =>
    new ActionRowBuilder<StringSelectMenuBuilder>()
      .addComponents(new StringSelectMenuBuilder()
        .setCustomId(JSON.stringify({
          ...customId,
          d: Date.now() + index++,
        }))
        .setOptions(group)
        .setMaxValues(group.length)));
}

export function editStringSelectById(
  components: (ActionRow<MessageActionRowComponent> | ActionRowBuilder<StringSelectMenuBuilder>)[],
  selectId: string,
  options: {
    count?: number | null
    menu_disabled?: boolean | null
    menu_place_holder?: string | null
    option?: {
      id?: string | null
      count?: number | null
      label?: string | null
      value?: string | null
      default?: boolean | null
      description?: string | null
      emoji?: string | null
    }
    role?: Role | null
  },
) {
  if (!components) components = [];
  if (!selectId || !options) return components;
  if (!Object.keys(options).length) return components;

  return components.map(row => {
    const rowJson = <APIActionRowComponent<APIStringSelectComponent>>row.toJSON();

    if (!rowJson.components.length) return row;

    if (rowJson.components[0].type !== ComponentType.StringSelect) return row;

    if (rowJson.components.every(select => select.custom_id !== selectId)) return row;

    return new ActionRowBuilder<StringSelectMenuBuilder>()
      .addComponents(rowJson.components.map(select => {
        if (select.custom_id !== selectId)
          return new StringSelectMenuBuilder(select);

        const parsedId = <SelectRolesCustomId>JSON.parse(select.custom_id);

        const c = parsedId.c;

        const d = parsedId.d;

        const count = options.count ?? parsedId.count;

        return new StringSelectMenuBuilder()
          .setCustomId(JSON.stringify({ c, count, d }))
          .setDisabled(options.menu_disabled ?? select.disabled ?? false)
          .setOptions(select.options.map(option => {
            if (options.option?.id !== option.value)
              return new StringSelectMenuOptionBuilder(option);

            const optionValue = <SelectRolesOptionValue>JSON.parse(option.value);

            const id = options.role?.id ?? optionValue.id;

            const count = options.option?.count ?? optionValue.count;

            const name = `${option.label?.match(regexp.labelWithCount)?.[1]}`;

            const oldRole = options.role?.guild?.roles.cache.get(optionValue.id);

            const label = options.role && name === oldRole?.name ?
              `${options.role.name} ${count}` :
              `${name} ${count}`;

            return new StringSelectMenuOptionBuilder({
              label: options.option?.label ? `${options.option?.label} ${count}` : `${label}`,
              value: JSON.stringify({ count, id }),
              default: options.option?.default ?? option.default,
              description: options.option?.description || option.description,
              emoji: options.option?.emoji || option.emoji,
            });
          }))
          .setPlaceholder(options.menu_place_holder ?? select.placeholder ?? "");
      }));
  });
}

export function removeOptionsFromSelectMenu(
  components: ActionRow<MessageActionRowComponent>[] = [],
  menuId: string,
  optionIds: string | string[],
) {
  if (!components?.length) return [];
  if (!Array.isArray(optionIds)) optionIds = [optionIds];

  return components.reduce<(
    | ActionRow<MessageActionRowComponent>
    | ActionRowBuilder<StringSelectMenuBuilder>
  )[]>((acc, row) => {
    const rowJson = <APIActionRowComponent<APIStringSelectComponent>>row.toJSON();

    if (!rowJson.components.length) return acc;

    if (rowJson.components[0].type !== ComponentType.StringSelect) return acc.concat(row);

    const menus = rowJson.components.reduce<StringSelectMenuBuilder[]>((acc2, select) => {
      if (select.custom_id !== menuId)
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

export function removeOptionsByRolesFromSelect(
  roles: string | string[],
  components: ActionRow<MessageActionRowComponent>[],
) {
  if (!components?.length) return [];
  if (!Array.isArray(roles)) roles = [roles];

  return components.reduce<(
    | ActionRow<MessageActionRowComponent>
    | ActionRowBuilder<StringSelectMenuBuilder>
  )[]>((acc, row) => {
    const rowJson = <APIActionRowComponent<APIStringSelectComponent>>row.toJSON();

    if (!rowJson.components.length) return acc;

    if (rowJson.components[0].type !== ComponentType.StringSelect) return acc.concat(row);

    const menus = rowJson.components.reduce<StringSelectMenuBuilder[]>((acc2, select) => {
      select.options = select.options.filter(option => {
        const optionId = <SelectRolesOptionValue>JSON.parse(option.value);

        return !roles.includes(optionId.id);
      });

      if (!select.options.length) return acc2;

      return acc2.concat(new StringSelectMenuBuilder(select));
    }, []);

    if (!menus.length) return acc;

    return acc.concat(new ActionRowBuilder<StringSelectMenuBuilder>()
      .addComponents(menus));
  }, []);
}

export function setDefaultRole(
  components: (ActionRow<MessageActionRowComponent> | ActionRowBuilder<StringSelectMenuBuilder>)[],
  defaultRole: Snowflake | APIRole | Role,
) {
  if (typeof defaultRole !== "string") defaultRole = defaultRole.id;

  return components.map(row => {
    const rowJson = <APIActionRowComponent<APIStringSelectComponent>>row.toJSON();

    if (rowJson.components[0].type !== ComponentType.StringSelect) return row;

    return new ActionRowBuilder<StringSelectMenuBuilder>()
      .addComponents(rowJson.components.map(element => {
        const selectMenu = new StringSelectMenuBuilder(element);

        return selectMenu.setOptions(element.options.map(option => {
          const value = JSONparse(option.value);

          return new StringSelectMenuOptionBuilder(option)
            .setDefault(defaultRole === (value?.id ?? value?.roleId));
        }));
      }));
  });
}
