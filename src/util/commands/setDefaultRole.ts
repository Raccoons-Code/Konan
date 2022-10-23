import { ActionRow, ActionRowBuilder, APIActionRowComponent, APIRole, APISelectMenuComponent, ComponentType, MessageActionRowComponent, Role, SelectMenuBuilder, SelectMenuOptionBuilder, Snowflake } from 'discord.js';
import { JSONparse } from './JSONparse';

export function setDefaultRole(
  components: (ActionRow<MessageActionRowComponent> | ActionRowBuilder<SelectMenuBuilder>)[],
  defaultRole: Snowflake | APIRole | Role,
) {
  if (typeof defaultRole !== 'string') defaultRole = defaultRole.id;

  return components.map(row => {
    const rowJson = <APIActionRowComponent<APISelectMenuComponent>>row.toJSON();

    if (rowJson.components[0].type !== ComponentType.SelectMenu) return row;

    return new ActionRowBuilder<SelectMenuBuilder>()
      .addComponents(rowJson.components.map(element => {
        const selectMenu = new SelectMenuBuilder(element);

        return selectMenu.setOptions(element.options.map(option => {
          const value = JSONparse(option.value);

          return new SelectMenuOptionBuilder(option)
            .setDefault(defaultRole === (value?.id ?? value?.roleId));
        }));
      }));
  });
}