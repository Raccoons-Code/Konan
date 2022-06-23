import { MessageActionRow, MessageButton, Role } from 'discord.js';

export function addButtonRoles(
  roles: Role[],
  components: (MessageActionRow | undefined)[] = [],
): MessageActionRow[] {
  for (let i = 0; i < 5; i++) {
    if (!roles.length) break;

    const component = components[i];

    if (!component) {
      const array = roles.splice(0, 5);

      components.push(new MessageActionRow()
        .setComponents(array.map(role => new MessageButton()
          .setCustomId(JSON.stringify({
            c: 'buttonroles',
            count: 0,
            roleId: role.id,
          }))
          .setLabel(`${role.name.slice(0, 63)} 0`)
          .setStyle('PRIMARY'))));

      continue;
    }

    if (component.components[0].type !== 'BUTTON') continue;

    const array = roles.splice(0, 5 - component.components.length);

    component.addComponents(array.map(role => new MessageButton()
      .setCustomId(JSON.stringify({
        c: 'buttonroles',
        count: 0,
        roleId: role.id,
      }))
      .setLabel(`${role.name.slice(0, 63)} 0`)
      .setStyle('PRIMARY')));

    components[i] = component;
  }

  return <MessageActionRow[]>components;
}