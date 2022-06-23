import { MessageActionRow } from 'discord.js';

export function removeButtonRoles(roles: string[], components: MessageActionRow[] = []): MessageActionRow[] {
  return components.map(component => {
    if (component.components[0].type !== 'BUTTON') return component;

    component.setComponents(component.components.filter(button =>
      !roles.includes(JSON.parse(button.customId!).roleId)));

    return component;
  }).filter(component => component.components.length);
}