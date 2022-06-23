import { MessageActionRow, Role } from 'discord.js';

export function setDefaultRole(
  components: MessageActionRow[],
  defaultRole: Role,
): MessageActionRow[] {
  return components.map(component => {
    component.components.map(element => {
      if (element.type !== 'SELECT_MENU') return element;

      element.options.map(option => {
        option.default = JSON.parse(option.value).roleId === defaultRole.id;

        return option;
      });

      return element;
    });

    return component;
  });
}