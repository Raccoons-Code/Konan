import { ActionRow, ActionRowBuilder, APIActionRowComponent, APIRole, APISelectMenuComponent, ComponentType, MessageActionRowComponent, Role, SelectMenuBuilder, SelectMenuOptionBuilder } from 'discord.js';

export function addSelectRoles(
  roles: APIRole | Role | (APIRole | Role)[],
  components: ActionRow<MessageActionRowComponent>[] = [],
  menuPlaceholder: string | null = '',
): (ActionRow<MessageActionRowComponent> | ActionRowBuilder<SelectMenuBuilder>)[] {
  if (!Array.isArray(roles)) return addSelectRoles([roles], components, menuPlaceholder);

  const newComponents = components
    .filter(component => component)
    .map(component => {
      const componentJson = <APIActionRowComponent<APISelectMenuComponent>>component.toJSON();

      if (componentJson.components[0].type !== ComponentType.SelectMenu) return component;
      if (componentJson.components[0].options.length === 25) return component;

      const newComponent = new ActionRowBuilder<SelectMenuBuilder>(componentJson);

      return newComponent
        .setComponents(newComponent.components.map(element => {
          const newElement = new SelectMenuBuilder(element.toJSON());

          return newElement
            .addOptions(roles.splice(0, 25 - newElement.options.length)
              .map(role => new SelectMenuOptionBuilder()
                .setLabel(`${role.name.slice(0, 83)} 0`)
                .setValue(JSON.stringify({
                  count: 0,
                  roleId: role.id,
                }))))
            .setMaxValues(newElement.options.length)
            .setPlaceholder(menuPlaceholder ?? newElement.data.placeholder ?? '');
        }));
    });

  for (let i = 0; i < 5 - newComponents.length; i++) {
    if (!roles.length) break;

    const array = roles.splice(0, 25);

    newComponents.push(new ActionRowBuilder<SelectMenuBuilder>()
      .setComponents(new SelectMenuBuilder()
        .setCustomId(JSON.stringify({
          c: 'selectroles',
          count: 0,
        }))
        .setOptions(array.map(role => new SelectMenuOptionBuilder()
          .setLabel(`${role.name.slice(0, 83)} 0`)
          .setValue(JSON.stringify({
            count: 0,
            roleId: role.id,
          }))))
        .setMaxValues(array.length)
        .setPlaceholder(menuPlaceholder ?? '')));
  }

  return newComponents;
}