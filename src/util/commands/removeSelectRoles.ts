import { ActionRow, ActionRowBuilder, APIActionRowComponent, APISelectMenuComponent, APISelectMenuOption, ComponentType, MessageActionRowComponent, SelectMenuBuilder, SelectMenuOptionBuilder } from 'discord.js';

const { SelectMenu } = ComponentType;

export function removeSelectRoles(
  components: ActionRow<MessageActionRowComponent>[] = [],
  roles: string[],
) {
  return components.map(row => {
    const rowJson = <APIActionRowComponent<APISelectMenuComponent>>row.toJSON();

    if (rowJson.components[0].type !== SelectMenu) return row;

    return new ActionRowBuilder<SelectMenuBuilder>()
      .setComponents(rowJson.components.map(element => {
        const newSelectMenu = new SelectMenuBuilder(element);

        return newSelectMenu.setOptions(element.options.reduce((acc: APISelectMenuOption[], option) => {
          if (roles.includes(JSON.parse(option.value).roleId)) return acc;

          return acc.concat(new SelectMenuOptionBuilder(option).toJSON());
        }, <APISelectMenuOption[]>[]));
      }).filter(element => element.data.type === SelectMenu ? element.options.length : true));
  }).filter(row => row.components.length);
}