import { ActionRow, ActionRowBuilder, MessageActionRowComponent, Role, SelectMenuBuilder, SelectMenuOptionBuilder } from 'discord.js';

export function createSelectRoles(
  { roles, menuPlaceholder = '', defaultRole }: {
    roles: Role[][];
    menuPlaceholder?: string | null;
    defaultRole?: Role | null;
  },
  components: (ActionRow<MessageActionRowComponent> | ActionRowBuilder<SelectMenuBuilder>)[] = [],
  index = 0,
): (ActionRow<MessageActionRowComponent> | ActionRowBuilder<SelectMenuBuilder>)[] {
  if (!roles[index]) return components;

  components[index] = new ActionRowBuilder<SelectMenuBuilder>()
    .setComponents(new SelectMenuBuilder()
      .setCustomId(JSON.stringify({
        c: 'selectroles',
        count: 0,
      }))
      .setMaxValues(roles[index].length)
      .setOptions(roles[index].map(role => new SelectMenuOptionBuilder()
        .setDefault(role.id === defaultRole?.id)
        .setLabel(`${role.name.slice(0, 83)} 0`)
        .setValue(JSON.stringify({
          count: 0,
          roleId: role.id,
        }))))
      .setPlaceholder(menuPlaceholder ?? ''));

  return createSelectRoles({ roles, menuPlaceholder, defaultRole }, components, index + 1);
}