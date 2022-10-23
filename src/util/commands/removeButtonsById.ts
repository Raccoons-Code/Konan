import { ActionRow, ActionRowBuilder, APIActionRowComponent, APIButtonComponent, ButtonBuilder, ButtonStyle, ComponentType, MessageActionRowComponent } from 'discord.js';

export function removeButtonsById(
  components: ActionRow<MessageActionRowComponent>[] = [],
  customId: string[],
): (ActionRow<MessageActionRowComponent> | ActionRowBuilder<ButtonBuilder>)[] {
  return components.map(row => {
    const rowJson = <APIActionRowComponent<APIButtonComponent>>row.toJSON();

    if (rowJson.components[0].type !== ComponentType.Button) return row;

    return new ActionRowBuilder<ButtonBuilder>()
      .addComponents(rowJson.components.reduce((acc, element) => {
        const newElement = new ButtonBuilder(element);

        if (element.style === ButtonStyle.Link) return acc.concat(newElement);
        if (customId.includes(element.custom_id)) return acc;

        return acc.concat(newElement);
      }, <ButtonBuilder[]>[]));
  }).filter(row => row.components.length);
}