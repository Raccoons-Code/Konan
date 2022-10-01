import { ActionRowBuilder, SelectMenuBuilder, SelectMenuOptionBuilder } from 'discord.js';
import type { ManageSelectRolesOptions } from '../../@types';
import splitArrayInGroups from '../splitArrayInGroups';

export function createSelectMenuByRoles(options: ManageSelectRolesOptions) {
  let index = 1;

  return splitArrayInGroups(options.roles, 25).map(group => new ActionRowBuilder<SelectMenuBuilder>()
    .setComponents(new SelectMenuBuilder()
      .setCustomId(JSON.stringify({
        c: 'selectroles',
        count: 0,
        d: index++ && Date.now() + index,
      }))
      .setMaxValues(group.length)
      .setOptions(group.map(role => new SelectMenuOptionBuilder()
        .setDefault(role.id === options.defaultRole?.id)
        .setLabel(`${role.name.slice(0, 83)} 0`)
        .setValue(JSON.stringify({
          count: 0,
          id: role.id,
        }))))
      .setPlaceholder(options.menuPlaceholder ?? '')));
}