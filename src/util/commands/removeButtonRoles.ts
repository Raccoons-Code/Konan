import { ActionRow, ActionRowBuilder, APIActionRowComponent, APIButtonComponent, ButtonBuilder, ButtonStyle, ComponentType, MessageActionRowComponent } from 'discord.js';
import { safeParseJSON } from './safeParseJSON';

export function removeButtonRoles(
  components: ActionRow<MessageActionRowComponent>[] = [],
  roles: string[],
) {
  return components.map(row => {
    const rowJson = <APIActionRowComponent<APIButtonComponent>>row.toJSON();

    if (rowJson.components[0].type !== ComponentType.Button) return row;

    return new ActionRowBuilder<ButtonBuilder>(rowJson)
      .setComponents(rowJson.components.reduce((acc, element) => {
        const newElement = new ButtonBuilder(element);

        if (element.style === ButtonStyle.Link) return acc.concat(newElement);
        if (roles.includes(safeParseJSON(element.custom_id)?.roleId)) return acc;

        return acc.concat(newElement);
      }, <ButtonBuilder[]>[]));
  }).filter(row => row.components.length);
}