import { ActionRow, ActionRowBuilder, ButtonBuilder, ComponentType, MessageActionRowComponent } from 'discord.js';

const { Button } = ComponentType;

export function removeButtonRoles(
  components: ActionRow<MessageActionRowComponent>[] = [],
  roles: string[],
) {
  return components.map(row => {
    if (row.components[0].type !== Button) return row;

    return new ActionRowBuilder<ButtonBuilder>()
      .setComponents(row.components.reduce((acc: ButtonBuilder[], button) => {
        if (roles.includes(JSON.parse(button.customId!).roleId)) return acc;

        return acc.concat(new ButtonBuilder(button.toJSON()));
      }, <ButtonBuilder[]>[]));
  }).filter(row => row.components.length);
}