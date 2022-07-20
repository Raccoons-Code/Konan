import { ActionRow, ActionRowBuilder, APIRole, ButtonBuilder, ButtonStyle, ComponentType, MessageActionRowComponent, Role } from 'discord.js';

export function addButtonRoles(
  roles: APIRole | Role | (APIRole | Role)[],
  components: ActionRow<MessageActionRowComponent>[] = [],
): (ActionRow<MessageActionRowComponent> | ActionRowBuilder<ButtonBuilder>)[] {
  if (!Array.isArray(roles)) return addButtonRoles([roles], components);

  const newComponents = components
    .filter(component => component)
    .map(component => {
      const componentJson = component.toJSON();

      if (componentJson.components[0].type !== ComponentType.Button) return component;
      if (componentJson.components.length === 5) return component;

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
            .setStyle(ButtonStyle.Primary)));
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
        .setStyle(ButtonStyle.Primary))));
  }

  return newComponents;
}