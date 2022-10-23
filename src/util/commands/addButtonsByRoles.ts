import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, MessageActionRowComponent } from 'discord.js';
import type { ManageButtonRolesOptions } from '../../@types';
import { createButtonsByRoles } from './createButtonsByRoles';

export function addButtonsByRoles(
  options: ManageButtonRolesOptions,
  components: (ActionRow<MessageActionRowComponent> | ActionRowBuilder<ButtonBuilder>)[] = [],
) {
  components = components
    .filter(component => component)
    .map(component => {
      const componentJson = component.toJSON();

      if (componentJson.components[0].type !== ComponentType.Button) return component;
      if (componentJson.components.length === 5) return component;

      return new ActionRowBuilder<ButtonBuilder>(componentJson)
        .addComponents(options.roles.splice(0, 5 - componentJson.components.length)
          .map(role => new ButtonBuilder()
            .setCustomId(JSON.stringify({
              c: 'buttonroles',
              count: 0,
              id: role.id,
            }))
            .setLabel(`${role.name.slice(0, 63)} 0`)
            .setStyle(ButtonStyle.Primary)));
    });

  return components.concat(createButtonsByRoles(options));
}