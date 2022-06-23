import { MessageActionRow, MessageButton, Role } from 'discord.js';

export function createButtonRoles(
  roles: Role[][],
  components: MessageActionRow[] = [],
  index = 0,
): MessageActionRow[] {
  if (!roles[index]) return components;

  components[index] = new MessageActionRow()
    .setComponents(roles[index]
      .map(role => new MessageButton()
        .setCustomId(JSON.stringify({
          c: 'buttonroles',
          count: 0,
          roleId: role.id,
        }))
        .setLabel(`${role.name.slice(0, 63)} 0`)
        .setStyle('PRIMARY')));

  return createButtonRoles(roles, components, index + 1);
}