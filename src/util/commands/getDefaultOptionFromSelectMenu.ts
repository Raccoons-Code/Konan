import { ActionRow, ActionRowBuilder, APISelectMenuOption, ComponentType, MessageActionRowComponent, MessageActionRowComponentBuilder } from 'discord.js';

export function getDefaultOptionFromSelectMenu(
  components: (ActionRow<MessageActionRowComponent> | ActionRowBuilder<MessageActionRowComponentBuilder>)[],
) {
  let optionDefault: APISelectMenuOption | undefined;

  components.some(row =>
    row.toJSON().components.some(element =>
      element.type === ComponentType.SelectMenu && element.options.some(option =>
        option.default && (optionDefault = option))));

  return optionDefault;
}