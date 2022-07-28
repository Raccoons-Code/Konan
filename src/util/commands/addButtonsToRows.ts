import { ActionRow, ActionRowBuilder, ButtonBuilder, ComponentType, MessageActionRowComponent } from 'discord.js';

export function addButtonsToRows(
  components: (ActionRow<MessageActionRowComponent> | ActionRowBuilder<ButtonBuilder>)[] = [],
  elements: ButtonBuilder[],
) {
  components = components
    .filter(component => component)
    .map(component => {
      const componentJson = component.toJSON();

      if (componentJson.components[0].type !== ComponentType.Button) return component;
      if (componentJson.components.length === 5) return component;

      return new ActionRowBuilder<ButtonBuilder>(componentJson)
        .addComponents(elements.splice(0, 5 - componentJson.components.length));
    });

  for (let i = 0; i < 5 - components.length; i++) {
    components.push(new ActionRowBuilder<ButtonBuilder>()
      .setComponents(elements.splice(0, 5)));

    if (!elements.length) break;
  }

  return components;
}