import { ActionRow, ActionRowBuilder, APIActionRowComponent, APIButtonComponent, ButtonBuilder, ButtonStyle, ComponentType, MessageActionRowComponent } from 'discord.js';
import type { ButtonRolesCustomId } from '../../@types';
import { JSONparse } from './JSONparse';

export function removeButtonsByRoleId(
  components: ActionRow<MessageActionRowComponent>[] = [],
  roles: string | string[],
): (ActionRow<MessageActionRowComponent> | ActionRowBuilder<ButtonBuilder>)[] {
  if (!Array.isArray(roles)) return removeButtonsByRoleId(components, [roles]);

  return components.map(row => {
    const rowJson = <APIActionRowComponent<APIButtonComponent>>row.toJSON();

    if (rowJson.components[0].type !== ComponentType.Button) return row;

    return new ActionRowBuilder<ButtonBuilder>()
      .setComponents(rowJson.components.reduce((acc, element) => {
        const newElement = new ButtonBuilder(element);

        if (element.style === ButtonStyle.Link) return acc.concat(newElement);

        const id = JSONparse<ButtonRolesCustomId>(element.custom_id);

        if (roles.includes(`${id?.id ?? id?.roleId}`)) return acc;

        return acc.concat(newElement);
      }, <ButtonBuilder[]>[]));
  }).filter(row => row.components.length);
}