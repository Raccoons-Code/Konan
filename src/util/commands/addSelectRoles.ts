import { ActionRow, ActionRowBuilder, ComponentType, MessageActionRowComponent, Role, SelectMenuBuilder, SelectMenuOptionBuilder } from 'discord.js';

const { SelectMenu } = ComponentType;

export function addSelectRoles(
  components: (ActionRow<MessageActionRowComponent> | null)[] = [],
  roles: Role[],
  menuPlaceholder: string | null = '',
) {
  const newComponents = <(ActionRow<MessageActionRowComponent> | ActionRowBuilder<SelectMenuBuilder>)[]>components;

  for (let i = 0; i < 5; i++) {
    if (!roles.length) break;

    const component = components[i];

    if (!component) {
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

      continue;
    }

    if (component.components[0].type !== SelectMenu) continue;

    const array = roles.splice(0, 25 - component.components[0].options.length);

    newComponents[i] = new ActionRowBuilder<SelectMenuBuilder>(component.toJSON())
      .setComponents(new SelectMenuBuilder(component.components[0].toJSON())
        .addOptions(array.map(role => new SelectMenuOptionBuilder()
          .setLabel(`${role.name.slice(0, 83)} 0`)
          .setValue(JSON.stringify({
            count: 0,
            roleId: role.id,
          }))))
        .setMaxValues(component.components[0].options.length + array.length)
        .setPlaceholder(menuPlaceholder ?? ''));
  }

  return newComponents;
}