import { ActionRow, ActionRowBuilder, APISelectMenuComponent, ComponentType, MessageActionRowComponent, Role, SelectMenuBuilder } from 'discord.js';

export function setDefaultRole(
  components: ActionRow<MessageActionRowComponent>[],
  defaultRole: Role,
) {
  return <ActionRowBuilder<SelectMenuBuilder>[]>components.map(row => {
    if (row.components[0].type !== ComponentType.SelectMenu) return row;

    return new ActionRowBuilder<SelectMenuBuilder>()
      .setComponents(row.components.map(element => {
        const selectMenu = new SelectMenuBuilder(<APISelectMenuComponent>element.toJSON());

        if (element.type !== ComponentType.SelectMenu) return selectMenu;

        selectMenu.setOptions(element.options.map(option => {
          option.default = JSON.parse(option.value).roleId === defaultRole.id;

          return option;
        }));

        return selectMenu;
      }));
  });
}