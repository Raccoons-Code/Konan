import { ActionRow, ActionRowBuilder, APIActionRowComponent, APISelectMenuComponent, MessageActionRowComponent, SelectMenuBuilder } from 'discord.js';

export function removeOptionsFromSelectMenu(
  components: ActionRow<MessageActionRowComponent>[] = [],
  menuId: string,
  optionId: string | string[],
): (ActionRow<MessageActionRowComponent> | ActionRowBuilder<SelectMenuBuilder>)[] {
  if (!Array.isArray(optionId)) return removeOptionsFromSelectMenu(components, menuId, [optionId]);

  return components.map(row => {
    const rowJson = <APIActionRowComponent<APISelectMenuComponent>>row.toJSON();

    if (rowJson.components[0].custom_id !== menuId) return row;

    return new ActionRowBuilder<SelectMenuBuilder>()
      .addComponents(rowJson.components.map(element => {
        const options = element.options.filter(option => optionId.includes(option.value));

        return new SelectMenuBuilder(element)
          .setOptions(options)
          .setMaxValues(Math.min(element.max_values ?? options.length, options.length));
      })
        .filter(element => element.options.length));
  }).filter(row => row.components.length);
}