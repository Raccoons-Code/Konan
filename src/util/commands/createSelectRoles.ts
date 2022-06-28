import { ActionRowBuilder, Role, SelectMenuBuilder, SelectMenuOptionBuilder } from 'discord.js';

export function createSelectRoles(
  { roles, menuPlaceholder = '', defaultRole }:
    { roles: Role[][]; menuPlaceholder?: string | null; defaultRole?: Role | null; },
) {
  return roles.map(array => new ActionRowBuilder<SelectMenuBuilder>()
    .setComponents(new SelectMenuBuilder()
      .setCustomId(JSON.stringify({
        c: 'selectroles',
        count: 0,
      }))
      .setMaxValues(array.length)
      .setOptions(array.map(role => new SelectMenuOptionBuilder()
        .setDefault(role.id === defaultRole?.id)
        .setLabel(`${role.name.slice(0, 83)} 0`)
        .setValue(JSON.stringify({
          count: 0,
          roleId: role.id,
        })).toJSON()))
      .setPlaceholder(menuPlaceholder ?? '')));
}