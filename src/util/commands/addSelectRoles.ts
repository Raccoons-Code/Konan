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
      components[i] = new MessageActionRow()
        .setComponents(new MessageSelectMenu()
          .setCustomId(JSON.stringify({
            c: 'selectroles',
            count: 0,
          }))
          .setOptions(roles.slice(0, 25).map(role => ({
            label: `${role.name.slice(0, 83)} 0`,
            value: JSON.stringify({
              count: 0,
              roleId: role.id,
            }),
          })))
          .setMaxValues(roles.slice(0, 25).length)
          .setPlaceholder(menuPlaceholder ?? ''));

      roles = roles.slice(25);

      continue;
    }

    if (component.components[0].type !== 'SELECT_MENU') continue;

    components[i] = component.addComponents(new MessageSelectMenu()
      .setCustomId(JSON.stringify({
        c: 'selectroles',
        count: 0,
      }))
      .setOptions(roles.slice(0, 25 - component.components[0].options.length).map(role => ({
        label: `${role.name.slice(0, 83)} 0`,
        value: JSON.stringify({
          count: 0,
          roleId: role.id,
        }),
      })))
      .setMaxValues(roles.slice(0, 25).length)
      .setPlaceholder(menuPlaceholder ?? ''));

    roles = roles.slice(component.components[0].options.length - 1);
  }

  return <MessageActionRow[]>components;
}