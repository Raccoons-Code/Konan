import { ActionRow, ActionRowBuilder, APIActionRowComponent, APIRole, APISelectMenuComponent, ComponentType, MessageActionRowComponent, Role, SelectMenuBuilder, SelectMenuOptionBuilder } from 'discord.js';
import { JSONparse } from './JSONparse';

export function setDefaultRole(
  components: (ActionRow<MessageActionRowComponent> | ActionRowBuilder<SelectMenuBuilder>)[],
  defaultRole: APIRole | Role,
) {
  return components.map(row => {
    const rowJson = <APIActionRowComponent<APISelectMenuComponent>>row.toJSON();

    if (rowJson.components[0].type !== ComponentType.SelectMenu) return row;

    return new ActionRowBuilder<SelectMenuBuilder>()
      .setComponents(rowJson.components.map(element => {
        const selectMenu = new SelectMenuBuilder(element);

        return selectMenu.setOptions(element.options.map(option => {
          const value = JSONparse(option.value);

          return new SelectMenuOptionBuilder(option)
            .setDefault(defaultRole.id === (value?.id ?? value?.roleId));
        }));
      }));
  });
}