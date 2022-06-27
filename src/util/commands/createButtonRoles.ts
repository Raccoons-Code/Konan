import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageActionRowComponent, Role } from 'discord.js';

const { Primary } = ButtonStyle;

export function createButtonRoles(
  roles: Role[][],
  components: (ActionRow<MessageActionRowComponent> | ActionRowBuilder<ButtonBuilder>)[] = [],
  index = 0,
): (ActionRow<MessageActionRowComponent> | ActionRowBuilder<ButtonBuilder>)[] {
  if (!roles[index]) return components;

  components[index] = new ActionRowBuilder<ButtonBuilder>()
    .setComponents(roles[index].map(role => new ButtonBuilder()
      .setCustomId(JSON.stringify({
        c: 'buttonroles',
        count: 0,
        roleId: role.id,
      }))
      .setLabel(`${role.name.slice(0, 63)} 0`)
      .setStyle(Primary)));

  return createButtonRoles(roles, components, index + 1);
}