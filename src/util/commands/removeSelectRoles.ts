import { MessageActionRow, MessageSelectOptionData } from 'discord.js';

export function removeSelectRoles(roles: string[], components: MessageActionRow[] = []): MessageActionRow[] {
  return components.map(component => {
    if (component.components[0].type !== 'SELECT_MENU') return component;

    component.components = component.components.map(element => {
      if (element.type !== 'SELECT_MENU') return element;

      element.setOptions(<MessageSelectOptionData[]>element.options.filter(option =>
        !roles.includes(JSON.parse(option.value!).roleId)))
        .setMaxValues(element.options.length);

      return element;
    }).filter(element => element.type === 'SELECT_MENU' ? element.options.length : true);

    return component;
  }).filter(component => component.components.length);
}