import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { ManageButtonRolesOptions } from '../../@types';
import splitArrayInGroups from '../splitArrayInGroups';

export function createButtonsByRoles(options: ManageButtonRolesOptions) {
  return splitArrayInGroups(options.roles, 5).map(array => new ActionRowBuilder<ButtonBuilder>()
    .setComponents(array.map(role => new ButtonBuilder()
      .setCustomId(JSON.stringify({
        c: 'buttonroles',
        count: 0,
        id: role.id,
      }))
      .setLabel(`${role.name.slice(0, 63)} 0`)
      .setStyle(ButtonStyle.Primary))));
}