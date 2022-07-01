import { ActionRowBuilder, APIRole, ButtonBuilder, ButtonStyle, Role } from 'discord.js';

const { Primary } = ButtonStyle;

export function createButtonRoles(roles: (APIRole | Role)[][]) {
  return roles.map(array => new ActionRowBuilder<ButtonBuilder>()
    .setComponents(array.map(role => new ButtonBuilder()
      .setCustomId(JSON.stringify({
        c: 'buttonroles',
        count: 0,
        roleId: role.id,
      }))
      .setLabel(`${role.name.slice(0, 63)} 0`)
      .setStyle(Primary))));
}