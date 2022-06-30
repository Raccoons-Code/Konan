import { ActionRow, APIRole, ButtonStyle, ComponentType, MessageActionRowComponent, Role } from 'discord.js';
import { safeParseJSON } from './safeParseJSON';

export function componentsHasRoles(
  components: ActionRow<MessageActionRowComponent>[],
  roles: APIRole | Role | (APIRole | Role)[],
): boolean {
  if (!roles) return false;
  if (!Array.isArray(roles)) return componentsHasRoles(components, [roles]);

  return roles.every(role => components.some(row => row.toJSON().components.some(element => {
    if (element.type === ComponentType.Button && element.style !== ButtonStyle.Link)
      return safeParseJSON(element.custom_id)?.roleId === role.id;

    if (element.type === ComponentType.SelectMenu)
      return element.options.some(option => safeParseJSON(option.value)?.roleId === role.id);
  })));
}