import { ActionRow, ActionRowBuilder, APIActionRowComponent, APISelectMenuComponent, ComponentType, MessageActionRowComponent, Role, SelectMenuBuilder, SelectMenuOptionBuilder } from 'discord.js';

export function setDefaultRole(
  components: (ActionRow<MessageActionRowComponent> | ActionRowBuilder<SelectMenuBuilder>)[],
  defaultRole: Role,
) {
  return components.map(row => {
    const rowJson = <APIActionRowComponent<APISelectMenuComponent>>row.toJSON();

    if (rowJson.components[0].type !== ComponentType.SelectMenu) return row;

    return new ActionRowBuilder<SelectMenuBuilder>()
      .setComponents(rowJson.components.map(element => {
        const selectMenu = new SelectMenuBuilder(element);

        return selectMenu.setOptions(element.options.map(option => new SelectMenuOptionBuilder(option)
          .setDefault(JSON.parse(option.value).roleId === defaultRole.id)));
      }));
  });
}