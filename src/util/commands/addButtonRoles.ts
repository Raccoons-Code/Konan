import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, MessageActionRowComponent, Role } from 'discord.js';

const { Primary } = ButtonStyle;
const { Button } = ComponentType;

export function addButtonRoles(
  components: (ActionRow<MessageActionRowComponent> | undefined)[] = [],
  roles: Role[],
) {
  const newComponents = <(ActionRow<MessageActionRowComponent> | ActionRowBuilder<ButtonBuilder>)[]>components;

  for (let i = 0; i < 5; i++) {
    if (!roles.length) break;

    const component = components[i];

    if (!component) {
      const array = roles.splice(0, 5);

      newComponents.push(new ActionRowBuilder<ButtonBuilder>()
        .setComponents(array.map(role => new ButtonBuilder()
          .setCustomId(JSON.stringify({
            c: 'buttonroles',
            count: 0,
            roleId: role.id,
          }))
          .setLabel(`${role.name.slice(0, 63)} 0`)
          .setStyle(Primary))));

      continue;
    }

    if (component.components[0].type !== Button) continue;

    const array = roles.splice(0, 5 - component.components.length);

    newComponents[i] = new ActionRowBuilder<ButtonBuilder>(component.toJSON())
      .addComponents(array.map(role => new ButtonBuilder()
        .setCustomId(JSON.stringify({
          c: 'buttonroles',
          count: 0,
          roleId: role.id,
        }))
        .setLabel(`${role.name.slice(0, 63)} 0`)
        .setStyle(Primary)));
  }

  return newComponents;
}