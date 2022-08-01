import { ActionRow, ActionRowBuilder, APIActionRowComponent, APISelectMenuComponent, ComponentType, MessageActionRowComponent, SelectMenuBuilder, SelectMenuOptionBuilder } from 'discord.js';
import type { ManageSelectRolesOptions } from '../../@types';
import { createSelectMenuByRoles } from './createSelectMenuByRoles';

export function addSelectMenuByRoles(
  options: ManageSelectRolesOptions,
  components: (ActionRow<MessageActionRowComponent> | ActionRowBuilder<SelectMenuBuilder>)[] = [],
): (ActionRow<MessageActionRowComponent> | ActionRowBuilder<SelectMenuBuilder>)[] {
  if (!Array.isArray(options.roles)) return addSelectMenuByRoles({ ...options, roles: [options.roles] }, components);

  components = components
    .filter(component => component)
    .map(component => {
      const componentJson = <APIActionRowComponent<APISelectMenuComponent>>component.toJSON();

      if (componentJson.components[0].type !== ComponentType.SelectMenu) return component;
      if (componentJson.components[0].options.length === 25) return component;

      return new ActionRowBuilder<SelectMenuBuilder>()
        .setComponents(componentJson.components.map(element => {
          const roles = options.roles.splice(0, 25 - element.options.length);

          return new SelectMenuBuilder(element)
            .addOptions(roles.map(role => new SelectMenuOptionBuilder()
              .setDefault(role.id === options.defaultRole?.id)
              .setLabel(`${role.name.slice(0, 83)} 0`)
              .setValue(JSON.stringify({
                count: 0,
                id: role.id,
              }))))
            .setMaxValues(roles.length + element.options.length)
            .setPlaceholder(options.menuPlaceholder ?? element.placeholder ?? '');
        }));
    });

  return components.concat(createSelectMenuByRoles(options));
}