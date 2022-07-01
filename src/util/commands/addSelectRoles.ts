import { MessageActionRow, MessageSelectMenu, Role } from 'discord.js';

export function addSelectRoles(
  roles: Role[],
  components: MessageActionRow[] = [],
  menuPlaceholder: string | null = '',
): MessageActionRow[] {
  const newComponents = components
    .filter(component => component)
    .map(component => {
      if (component.components[0].type !== 'SELECT_MENU') return component;
      if (component.components[0].options.length === 25) return component;

      const newComponent = new MessageActionRow<MessageSelectMenu>(component.toJSON());

      return newComponent
        .setComponents(newComponent.components.map(element => {
          const newElement = new MessageSelectMenu(element.toJSON());

          return newElement
            .addOptions(roles.splice(0, 25 - newElement.options.length)
              .map(role => ({
                label: `${role.name.slice(0, 83)} 0`,
                value: JSON.stringify({
                  count: 0,
                  roleId: role.id,
                }),
              })))
            .setMaxValues(newElement.options.length)
            .setPlaceholder(menuPlaceholder ?? '');
        }));
    });

  for (let i = 0; i < 5 - newComponents.length; i++) {
    if (!roles.length) break;

    const array = roles.splice(0, 25);

    newComponents.push(new MessageActionRow<MessageSelectMenu>()
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
  }

  return newComponents;
}