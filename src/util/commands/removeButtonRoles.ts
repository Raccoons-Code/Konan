import { ActionRow, ActionRowBuilder, APIActionRowComponent, APIButtonComponent, ButtonBuilder, ButtonStyle, ComponentType, MessageActionRowComponent } from 'discord.js';

const { Button } = ComponentType;

export function removeButtonRoles(
  components: ActionRow<MessageActionRowComponent>[] = [],
  roles: string[],
) {
  return components.map(row => {
    const rowJson = <APIActionRowComponent<APIButtonComponent>>row.toJSON();

    if (rowJson.components[0].type !== Button) return row;

    return new ActionRowBuilder<ButtonBuilder>()
      .setComponents(rowJson.components.reduce((acc: ButtonBuilder[], button) => {
        if (button.style === ButtonStyle.Link) return acc.concat(new ButtonBuilder(button));

        if (roles.includes(JSON.parse(button.custom_id).roleId)) return acc;

        return acc.concat(new ButtonBuilder(button));
      }, <ButtonBuilder[]>[]));
  }).filter(row => row.components.length);
}