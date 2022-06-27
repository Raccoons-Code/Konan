import { ActionRow, APIRole, ComponentType, MessageActionRowComponent, Role } from 'discord.js';
import { safeParseJSON } from './safeParseJSON';

export function componentsHasRoles(components: ActionRow<MessageActionRowComponent>[], roles: (APIRole | Role)[]) {
  if (!Array.isArray(roles)) roles = [roles];

  return components.some(row => row.components.some(element => {
    if (element.type === ComponentType.Button)
      return roles.some(role => role.id === safeParseJSON(`${element.customId}`)?.roleId);

    if (element.type === ComponentType.SelectMenu)
      return element.options.some(option =>
        roles.some(role => role.id === safeParseJSON(`${option.value}`)?.roleId));
  }));
}