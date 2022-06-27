import { ActionRow, ActionRowBuilder, APISelectMenuComponent, ComponentType, MessageActionRowComponent, SelectMenuBuilder, SelectMenuOptionBuilder } from 'discord.js';

const { SelectMenu } = ComponentType;

export function removeSelectRoles(
  components: ActionRow<MessageActionRowComponent>[] = [],
  roles: string[],
) {
  return components.map(row => {
    if (row.components[0].type !== SelectMenu) return row;

    return new ActionRowBuilder<SelectMenuBuilder>()
      .setComponents(row.components.map(element => {
        const newSelectMenu = new SelectMenuBuilder(<APISelectMenuComponent>element.toJSON());

        if (element.type !== SelectMenu) return newSelectMenu;

        newSelectMenu.setOptions(element.options.reduce((acc: SelectMenuOptionBuilder[], option) => {
          if (roles.includes(JSON.parse(option.value).roleId)) return acc;

          return acc.concat(new SelectMenuOptionBuilder(option));
        }, <SelectMenuOptionBuilder[]>[]));

        return newSelectMenu;
      }).filter(element => element.data.type === SelectMenu ? element.options.length : true));
  }).filter(row => row.components.length);
}