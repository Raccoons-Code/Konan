import { ActionRow, ActionRowBuilder, APIActionRowComponent, APISelectMenuComponent, APISelectMenuOption, ComponentType, MessageActionRowComponent, SelectMenuBuilder, SelectMenuComponentOptionData, SelectMenuOptionBuilder } from 'discord.js';
import { createSelectMenuFromOptions } from './createSelectMenuFromOptions';
import { JSONparse } from './JSONparse';

export function addOptionsToSelectMenuInRow(
  components: (ActionRow<MessageActionRowComponent> | ActionRowBuilder<SelectMenuBuilder>)[],
  menuId: string,
  options: (APISelectMenuOption | SelectMenuComponentOptionData | SelectMenuOptionBuilder)[],
) {
  components = components.map(row => {
    const rowJson = <APIActionRowComponent<APISelectMenuComponent>>row.toJSON();

    if (rowJson.components[0].type !== ComponentType.SelectMenu) return row;
    if (rowJson.components[0].custom_id !== menuId) return row;

    return new ActionRowBuilder<SelectMenuBuilder>()
      .addComponents(rowJson.components.map(element => {
        const newOptions = options.splice(0, 25 - element.options.length);

        return new SelectMenuBuilder(element)
          .addOptions(newOptions)
          .setMaxValues(newOptions.length + element.options.length);
      }));
  });

  return components.concat(createSelectMenuFromOptions(options, JSONparse(menuId)!));
}