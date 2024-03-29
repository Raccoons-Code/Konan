import { ActionRow, APIActionRowComponent, APIActionRowComponentTypes, APIButtonComponentWithCustomId, APIChannelSelectComponent, APIMentionableSelectComponent, APIRole, APIRoleSelectComponent, APIStringSelectComponent, APITextInputComponent, APIUserSelectComponent, ButtonStyle, ComponentType, JSONEncodable, MessageActionRowComponent, Role } from "discord.js";
import { ButtonRolesCustomId, SelectRolesOptionValue } from "../../../@types";
import { JSONparse } from "../../utils";

export function componentsHasRoles(
  components: ActionRow<MessageActionRowComponent>[],
  roles: APIRole | Role | (APIRole | Role)[],
): boolean {
  if (!components?.length || !roles) return false;
  if (!Array.isArray(roles)) roles = [roles];

  return roles.every(role => components.some(row => row.toJSON().components.some(element => {
    if (element.type === ComponentType.Button && element.style !== ButtonStyle.Link) {
      const value = JSONparse<ButtonRolesCustomId>(element.custom_id);

      return role.id === (value?.id ?? value?.roleId);
    }

    if (element.type === ComponentType.StringSelect) {
      return element.options.some(option => {
        const value = JSONparse<SelectRolesOptionValue>(option.value);

        return role.id === (value?.id ?? value?.roleId);
      });
    }

    return false;
  })));
}

export function componentsHasRowType(
  components: ActionRow<MessageActionRowComponent>[],
  type: ComponentType,
) {
  return components.some(row => {
    const rowJson = row.toJSON();

    if (rowJson.type === type) return true;

    return rowJson.components.some(element => element.type === type);
  });
}

export function componentsHasRowById(
  components: ActionRow<MessageActionRowComponent>[],
  customId: string | string[],
) {
  if (!Array.isArray(customId)) customId = [customId];

  return components.some(row =>
    row.toJSON().components.some(element =>
      "custom_id" in element && customId.includes(element.custom_id)));
}

export function filterCustomId(
  components: ActionRow<MessageActionRowComponent>[],
  customIds: string[],
) {
  if (!components?.length) return customIds;
  if (!customIds?.length) return [];

  for (const row of components) {
    const rowJson = row.toJSON();

    if (!rowJson.components?.length) continue;

    for (const element of rowJson.components) {
      if (element.type === ComponentType.Button && element.style !== ButtonStyle.Link) {
        if (customIds.includes(element.custom_id)) {
          customIds.splice(customIds.indexOf(element.custom_id), 1);

          continue;
        }

        const value = JSONparse<ButtonRolesCustomId>(element.custom_id);

        if (customIds.includes(value?.id ?? value?.roleId ?? element.custom_id))
          customIds.splice(customIds.indexOf(value?.id ?? value?.roleId ?? element.custom_id), 1);

        continue;
      }

      if (element.type === ComponentType.StringSelect) {
        for (const option of element.options) {
          if (customIds.includes(option.value)) {
            customIds.splice(customIds.indexOf(option.value), 1);

            continue;
          }

          const value = JSONparse<SelectRolesOptionValue>(option.value);

          if (customIds.includes(value?.id ?? option.value)) {
            customIds.splice(customIds.indexOf(value?.id ?? option.value), 1);

            continue;
          }
        }

        continue;
      }
    }
  }

  return customIds;
}

export function getComponentById(
  components: JSONEncodable<APIActionRowComponent<APIActionRowComponentTypes>>[],
  customId: string | string[],
) {
  if (!Array.isArray(customId)) customId = [customId];

  let component:
    | APIButtonComponentWithCustomId
    | APIStringSelectComponent
    | APIUserSelectComponent
    | APIRoleSelectComponent
    | APIMentionableSelectComponent
    | APIChannelSelectComponent
    | APITextInputComponent
    | undefined;

  components.some(row =>
    row.toJSON().components.some(element =>
      "custom_id" in element && customId.includes(element.custom_id) && (component = element)));

  return component;
}

export function getMessageComponentsAmount(
  components: ActionRow<MessageActionRowComponent>[],
) {
  const result = components.reduce((acc, row) => {
    acc.rows++;

    const rowJson = row.toJSON();

    let elementType: "buttonRows" | "selectRows" | undefined;

    for (const element of rowJson.components) {
      if (element.type === ComponentType.Button) {
        acc.buttons++;
        elementType = "buttonRows";
        continue;
      }

      if (element.type === ComponentType.StringSelect) {
        acc.select.string++;
        acc.select.options += element.options.length;
        elementType = "selectRows";
        continue;
      }
    }

    acc[elementType ?? "other"]++;

    return acc;
  }, {
    rows: 0,
    buttonRows: 0,
    buttons: 0,
    selectRows: 0,
    select: {
      string: 0,
      options: 0,
    },
    other: 0,
    fullRows: false,
    fullButtonRows: false,
    fullSelectOptions: false,
  });

  result.fullRows = result.rows > 4;
  result.fullButtonRows = result.buttons / result.buttonRows >= 5;
  result.fullSelectOptions = result.select.options / result.selectRows >= 25;

  return result;
}
