import { ActionRow, ActionRowBuilder, APIActionRowComponent, APISelectMenuComponent, ComponentType, MessageActionRowComponent, SelectMenuBuilder } from 'discord.js';
import { safeParseJSON } from './safeParseJSON';

export function removeSelectRoles(
  components: ActionRow<MessageActionRowComponent>[] = [],
  roles: string | string[],
): (ActionRow<MessageActionRowComponent> | ActionRowBuilder<SelectMenuBuilder>)[] {
  if (!Array.isArray(roles)) return removeSelectRoles(components, [roles]);

  return components.map(row => {
    const rowJson = <APIActionRowComponent<APISelectMenuComponent>>row.toJSON();

    if (rowJson.components[0].type !== ComponentType.SelectMenu) return row;

    return new ActionRowBuilder<SelectMenuBuilder>(rowJson)
      .setComponents(rowJson.components.map(element => new SelectMenuBuilder(element)
        .setOptions(element.options.filter(option => !roles.includes(safeParseJSON(option.value)?.roleId))))
        .filter(element => element.data.type === ComponentType.SelectMenu ? element.options.length : true));
  }).filter(row => row.components.length);
}