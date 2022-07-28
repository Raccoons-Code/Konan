import { ActionRow, ActionRowBuilder, APIActionRowComponent, APISelectMenuComponent, ComponentType, MessageActionRowComponent, SelectMenuBuilder } from 'discord.js';
import { JSONparse } from './JSONparse';

export function removeOptionsByRolesFromSelectMenu(
  components: ActionRow<MessageActionRowComponent>[] = [],
  roles: string | string[],
): (ActionRow<MessageActionRowComponent> | ActionRowBuilder<SelectMenuBuilder>)[] {
  if (!Array.isArray(roles)) return removeOptionsByRolesFromSelectMenu(components, [roles]);

  return components.map(row => {
    const rowJson = <APIActionRowComponent<APISelectMenuComponent>>row.toJSON();

    if (rowJson.components[0].type !== ComponentType.SelectMenu) return row;

    return new ActionRowBuilder<SelectMenuBuilder>()
      .setComponents(rowJson.components.map(element => {
        const options = element.options.filter(option => {
          const value = JSONparse(option.value);

          return !roles.includes(value?.id ?? value?.roleId);
        });

        return new SelectMenuBuilder(element)
          .setOptions(options)
          .setMaxValues(Math.min(element.max_values ?? options.length, options.length));
      })
        .filter(element => element.options.length));
  }).filter(row => row.components.length);
}