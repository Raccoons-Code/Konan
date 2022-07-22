import { ActionRowBuilder, SelectMenuBuilder, SelectMenuOptionBuilder } from 'discord.js';
import { ManageSelectRolesOptions } from '../../@types';

export function createSelectRoles(options: ManageSelectRolesOptions) {
  return options.roles.map(array => new ActionRowBuilder<SelectMenuBuilder>()
    .setComponents(new SelectMenuBuilder()
      .setCustomId(JSON.stringify({
        c: 'selectroles',
        count: 0,
      }))
      .setMaxValues(array.length)
      .setOptions(array.map(role => new SelectMenuOptionBuilder()
        .setDefault(role.id === options.defaultRole?.id)
        .setLabel(`${role.name.slice(0, 83)} 0`)
        .setValue(JSON.stringify({
          count: 0,
          roleId: role.id,
        }))))
      .setPlaceholder(options.menuPlaceholder ?? '')));
}