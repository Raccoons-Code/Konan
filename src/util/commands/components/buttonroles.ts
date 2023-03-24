import { ActionRow, ActionRowBuilder, APIActionRowComponent, APIButtonComponent, APIButtonComponentWithCustomId, ButtonBuilder, ButtonStyle, ComponentType, MessageActionRowComponent, MessageActionRowComponentBuilder, Role } from "discord.js";
import { ButtonRolesCustomId, ManageButtonRolesOptions } from "../../../@types";
import regexp from "../../regexp";
import { splitArrayInGroups } from "../../utils";

export function addButtonsByRoles(
  options: ManageButtonRolesOptions,
  components?: (
    | ActionRow<MessageActionRowComponent>
    | ActionRowBuilder<ButtonBuilder>
  )[],
) {
  if (!components) components = [];
  if (!options || !options.roles?.length) return components;

  return components
    .map(row => {
      const rowJson = row.toJSON();

      if (!rowJson.components.length) return row;

      if (rowJson.components.length === 5) return row;

      if (rowJson.components[0].type !== ComponentType.Button) return row;

      return new ActionRowBuilder<ButtonBuilder>(rowJson)
        .addComponents(options.roles.splice(0, 5 - rowJson.components.length)
          .map(role => new ButtonBuilder()
            .setCustomId(JSON.stringify({
              c: "buttonroles",
              count: 0,
              id: role.id,
            }))
            .setLabel(`${role.name.slice(0, 63)} 0`)
            .setStyle(ButtonStyle.Primary)));
    })
    .concat(createButtonsByRoles(options));
}

export function addButtonsToRows(
  components: (
    | ActionRow<MessageActionRowComponent>
    | ActionRowBuilder<ButtonBuilder>
  )[] = [],
  elements: ButtonBuilder[],
) {
  components = components
    .map(row => {
      const rowJson = row.toJSON();

      if (!rowJson.components.length) return row;

      if (rowJson.components.length === 5) return row;

      if (rowJson.components[0].type !== ComponentType.Button) return row;

      return new ActionRowBuilder<ButtonBuilder>(rowJson)
        .addComponents(elements.splice(0, 5 - rowJson.components.length));
    });

  if (elements.length) {
    for (let i = 0; i < 5 - components.length; i++) {
      components.push(new ActionRowBuilder<ButtonBuilder>()
        .addComponents(elements.splice(0, 5)));

      if (!elements.length) break;
    }
  }

  return components;
}

export function createButtonsByRoles(options: ManageButtonRolesOptions) {
  return splitArrayInGroups(options.roles, 5)
    .map(array => new ActionRowBuilder<ButtonBuilder>()
      .addComponents(array.map(role => new ButtonBuilder()
        .setCustomId(JSON.stringify({
          c: "buttonroles",
          count: 0,
          id: role.id,
        }))
        .setLabel(`${role.name.slice(0, 63)} 0`)
        .setStyle(ButtonStyle.Primary))));
}

export function editButtonById(
  components: (
    | ActionRow<MessageActionRowComponent>
    | ActionRowBuilder<ButtonBuilder>
  )[],
  buttonId: string,
  options: {
    button_disabled?: boolean | null
    button_emoji?: string | null
    button_name?: string | null
    button_style?: number | null
    count?: number | null
    role?: Role | null
  },
) {
  if (!components?.length) return [];
  if (!buttonId) return components;

  return components.map(row => {
    const rowJson = <APIActionRowComponent<APIButtonComponentWithCustomId>>row.toJSON();

    if (!rowJson.components.length) return row;

    if (rowJson.components[0].type !== ComponentType.Button) return row;

    if (rowJson.components.every(button => button.custom_id !== buttonId)) return row;

    return new ActionRowBuilder<ButtonBuilder>()
      .addComponents(rowJson.components.map(button => {
        if (button.custom_id !== buttonId)
          return new ButtonBuilder(button);

        const parsedId = <ButtonRolesCustomId>JSON.parse(button.custom_id);

        const c = parsedId.c;

        const count = options.count ?? parsedId.count;

        const id = options.role?.id ?? parsedId.id ?? parsedId.roleId;

        const name = `${button.label?.match(regexp.labelWithCount)?.[1]}`;

        const oldRole = options.role?.guild?.roles.cache.get(parsedId.id);

        const label = options.role && name === oldRole?.name ?
          `${options.role.name} ${count}` :
          `${name} ${count}`;

        return new ButtonBuilder()
          .setCustomId(JSON.stringify({ c, count, id }))
          .setDisabled(options.button_disabled ?? button.disabled ?? false)
          .setEmoji(options.button_emoji ?? button.emoji ?? {})
          .setLabel(options.button_name ? `${options.button_name} ${count}` : `${label}`)
          .setStyle(options.button_style ?? button.style);
      }));
  });
}

export function removeButtonsById(
  components: ActionRow<MessageActionRowComponent>[],
  customIds: string[],
) {
  if (!components?.length) return [];
  if (!customIds?.length) return components;

  return components.reduce<(
    | ActionRow<MessageActionRowComponent>
    | ActionRowBuilder<ButtonBuilder>
  )[]>((acc, row) => {
    const rowJson = <APIActionRowComponent<APIButtonComponent>>row.toJSON();

    if (!rowJson.components.length) return acc;

    if (rowJson.components[0].type !== ComponentType.Button) return acc.concat(row);

    const buttons = rowJson.components.filter(button => {
      if (button.style === ButtonStyle.Link) return true;

      const buttonId = <ButtonRolesCustomId>JSON.parse(button.custom_id);

      return !(
        customIds.includes(buttonId.id ?? button.custom_id) ||
        customIds.includes(button.custom_id)
      );
    });

    if (!buttons.length) return acc;

    return acc.concat(new ActionRowBuilder<ButtonBuilder>()
      .addComponents(buttons.map(button => new ButtonBuilder(button))));
  }, []);
}

export function reorganizeButtons(
  components: (
    | ActionRow<MessageActionRowComponent>
    | ActionRowBuilder<MessageActionRowComponentBuilder>
  )[],
) {
  const buttons = components.reduce<APIButtonComponent[]>((acc, row) => {
    const rowJson = <APIActionRowComponent<APIButtonComponentWithCustomId>>row.toJSON();

    if (!rowJson.components.length) return acc;

    if (rowJson.components[0].type !== ComponentType.Button) return acc;

    return acc.concat(rowJson.components);
  }, []);

  return components.reduce<(
    | ActionRow<MessageActionRowComponent>
    | ActionRowBuilder<MessageActionRowComponentBuilder>
  )[]>((acc, row) => {
    const rowJson = <APIActionRowComponent<APIButtonComponentWithCustomId>>row.toJSON();

    if (!rowJson.components.length) return acc;

    if (rowJson.components[0].type !== ComponentType.Button) return acc.concat(row);

    if (!buttons.length) return acc;

    return acc.concat(new ActionRowBuilder<ButtonBuilder>()
      .addComponents(buttons.splice(0, 5).map(button => new ButtonBuilder(button))));
  }, []);
}
