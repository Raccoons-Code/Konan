import { ActionRow, ActionRowBuilder, APIActionRowComponent, APIButtonComponent, ButtonBuilder, ButtonStyle, ComponentType, MessageActionRowComponent } from 'discord.js';

export function removeButtonsById(
  components: ActionRow<MessageActionRowComponent>[] = [],
  customId: string,
) {
  return components.map(row => {
    const rowJson = <APIActionRowComponent<APIButtonComponent>>row.toJSON();

    if (rowJson.components[0].type !== ComponentType.Button) return row;

    return new ActionRowBuilder<ButtonBuilder>()
      .setComponents(rowJson.components.reduce((acc, element) => {
        const newElement = new ButtonBuilder(element);

        if (element.style === ButtonStyle.Link) return acc.concat(newElement);
        if (element.custom_id === customId) return acc;

        return acc.concat(newElement);
      }, <ButtonBuilder[]>[]));
  }).filter(row => row.components.length);
}