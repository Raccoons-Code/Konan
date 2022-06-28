import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, MessageActionRowComponent, Role } from 'discord.js';

const { Primary } = ButtonStyle;
const { Button } = ComponentType;

export function addButtonRoles(
  roles: Role[],
  components: (ActionRow<MessageActionRowComponent> | undefined)[] = [],
) {
  const newComponents = <ActionRowBuilder<ButtonBuilder>[]>components
    .filter(component => component)
    .map(component => {
      const componentJson = component?.toJSON();

      if (componentJson?.components[0].type !== Button) return component;
      if (componentJson?.components.length === 5) return component;

      const newComponent = new ActionRowBuilder<ButtonBuilder>(componentJson);

      return newComponent
        .addComponents(roles.splice(0, 5 - newComponent.components.length)
          .map(role => new ButtonBuilder()
            .setCustomId(JSON.stringify({
              c: 'buttonroles',
              count: 0,
              roleId: role.id,
            }))
            .setLabel(`${role.name.slice(0, 63)} 0`)
            .setStyle(Primary)));
    });

  for (let i = 0; i < 5 - newComponents.length; i++) {
    if (!roles.length) break;

    newComponents.push(new ActionRowBuilder<ButtonBuilder>()
      .setComponents(roles.splice(0, 5).map(role => new ButtonBuilder()
        .setCustomId(JSON.stringify({
          c: 'buttonroles',
          count: 0,
          roleId: role.id,
        }))
        .setLabel(`${role.name.slice(0, 63)} 0`)
        .setStyle(Primary))));
  }

  return newComponents;
}