import { MessageActionRow, MessageSelectMenu, Role } from 'discord.js';

export function createSelectRoles(
  { roles, menuPlaceholder = '', defaultRole }: {
    roles: Role[][];
    menuPlaceholder?: string | null;
    defaultRole?: Role | null;
  },
  components: MessageActionRow[] = [],
  index = 0,
): MessageActionRow[] {
  if (!roles[index]) return components;

  components[index] = new MessageActionRow()
    .setComponents(new MessageSelectMenu()
      .setCustomId(JSON.stringify({
        c: 'selectroles',
        count: 0,
      }))
      .setMaxValues(roles[index].length)
      .setOptions(roles[index].map(role => ({
        label: `${role.name.slice(0, 83)} 0`,
        value: JSON.stringify({
          count: 0,
          roleId: role.id,
        }),
        default: role.id === defaultRole?.id,
      })))
      .setPlaceholder(menuPlaceholder ?? ''));

  return createSelectRoles({ roles, menuPlaceholder, defaultRole }, components, index + 1);
}