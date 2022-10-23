import { ActionRow, ActionRowBuilder, APIActionRowComponent, APISelectMenuComponent, ComponentType, MessageActionRowComponent, MessageActionRowComponentBuilder, SelectMenuBuilder } from 'discord.js';

export function reorganizeOptionsByDefaultInSelectMenu(
  components: (ActionRow<MessageActionRowComponent> | ActionRowBuilder<MessageActionRowComponentBuilder>)[],
) {
  return components.map(row => {
    const rowJson = <APIActionRowComponent<APISelectMenuComponent>>row.toJSON();

    if (rowJson.components[0].type !== ComponentType.SelectMenu) return row;

    return new ActionRowBuilder<SelectMenuBuilder>()
      .addComponents(rowJson.components.map(element => new SelectMenuBuilder(element)
        .setOptions(element.options.sort(a => a.default ? -1 : 1))));
  });
}