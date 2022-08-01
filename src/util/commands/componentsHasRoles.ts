import { ActionRow, APIRole, ButtonStyle, ComponentType, MessageActionRowComponent, Role } from 'discord.js';
import type { ButtonRolesCustomId, SelectRolesOptionValue } from '../../@types';
import { JSONparse } from './JSONparse';

export function componentsHasRoles(
  components: ActionRow<MessageActionRowComponent>[],
  roles: APIRole | Role | (APIRole | Role)[],
): boolean {
  if (!roles) return false;
  if (!Array.isArray(roles)) return componentsHasRoles(components, [roles]);

  return roles.every(role => components.some(row => row.toJSON().components.some(element => {
    if (element.type === ComponentType.Button && element.style !== ButtonStyle.Link) {
      const value = JSONparse<ButtonRolesCustomId>(element.custom_id);

      return role.id === (value?.id ?? value?.roleId);
    }

    if (element.type === ComponentType.SelectMenu)
      return element.options.some(option => {
        const value = JSONparse<SelectRolesOptionValue>(option.value);

        return role.id === (value?.id ?? value?.roleId);
      });
  })));
}