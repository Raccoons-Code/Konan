import { MessageActionRow, MessageSelectMenu, Role } from 'discord.js';

export function addSelectRoles(
  roles: Role[],
  components: (MessageActionRow | null)[] = [],
  menuPlaceholder: string | null = '',
): MessageActionRow[] {
  for (let i = 0; i < 5; i++) {
    if (!roles.length) break;

    const component = components[i];

    if (!component) {
      const array = roles.splice(0, 25);

      components.push(new MessageActionRow()
        .setComponents(new MessageSelectMenu()
          .setCustomId(JSON.stringify({
            c: 'selectroles',
            count: 0,
          }))
          .setOptions(array.map(role => ({
            label: `${role.name.slice(0, 83)} 0`,
            value: JSON.stringify({
              count: 0,
              roleId: role.id,
            }),
          })))
          .setMaxValues(array.length)
          .setPlaceholder(menuPlaceholder ?? '')));

      continue;
    }

    if (component.components[0].type !== 'SELECT_MENU') continue;

    const array = roles.splice(0, 25 - component.components[0].options.length);

    component.components[0]
      .addOptions(array.map(role => ({
        label: `${role.name.slice(0, 83)} 0`,
        value: JSON.stringify({
          count: 0,
          roleId: role.id,
        }),
      })))
      .setMaxValues(component.components[0].options.length)
      .setPlaceholder(menuPlaceholder ?? '');

    components[i] = component;
  }

  return <MessageActionRow[]>components;
}