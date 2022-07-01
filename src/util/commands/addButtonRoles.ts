import { MessageActionRow, MessageButton, Role } from 'discord.js';

export function addButtonRoles(
  roles: Role[],
  components: MessageActionRow[] = [],
): MessageActionRow[] {
  const newComponents = components
    .filter(component => component)
    .map(component => {
      if (component.components[0].type !== 'BUTTON') return component;
      if (component.components.length === 5) return component;

      const newComponent = new MessageActionRow<MessageButton>(component.toJSON());

      return newComponent
        .addComponents(roles.splice(0, 5 - newComponent.components.length)
          .map(role => new MessageButton()
            .setCustomId(JSON.stringify({
              c: 'buttonroles',
              count: 0,
              roleId: role.id,
            }))
            .setLabel(`${role.name.slice(0, 63)} 0`)
            .setStyle('PRIMARY')));
    });

  for (let i = 0; i < 5 - newComponents.length; i++) {
    if (!roles.length) break;

    newComponents.push(new MessageActionRow<MessageButton>()
      .setComponents(roles.splice(0, 5).map(role => new MessageButton()
        .setCustomId(JSON.stringify({
          c: 'buttonroles',
          count: 0,
          roleId: role.id,
        }))
        .setLabel(`${role.name.slice(0, 63)} 0`)
        .setStyle('PRIMARY'))));
  }

  return newComponents;
}