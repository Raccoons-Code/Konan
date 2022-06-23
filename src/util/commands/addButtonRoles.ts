import { MessageActionRow, MessageButton, Role } from 'discord.js';

export function addButtonRoles(roles: Role[], components: (MessageActionRow | null)[] = []): MessageActionRow[] {
  for (let i = 0; i < 5; i++) {
    if (!roles.length) break;

    const component = components[i];

    if (!component) {
      components[i] = new MessageActionRow()
        .setComponents(roles.slice(0, 5)
          .map(role => new MessageButton()
            .setCustomId(JSON.stringify({
              c: 'buttonroles',
              count: 0,
              roleId: role.id,
            }))
            .setLabel(`${role.name.slice(0, 63)} 0`)
            .setStyle('PRIMARY')));

      roles = roles.slice(5);

      continue;
    }

    if (component.components[0].type !== 'BUTTON') continue;

    components[i] = component.addComponents(roles.slice(0, 5 - component.components.length)
      .map(role => new MessageButton()
        .setCustomId(JSON.stringify({
          c: 'buttonroles',
          count: 0,
          roleId: role.id,
        }))
        .setLabel(`${role.name.slice(0, 63)} 0`)
        .setStyle('PRIMARY')));

    roles = roles.slice(component.components.length - 1);
  }

  return <MessageActionRow[]>components;
}