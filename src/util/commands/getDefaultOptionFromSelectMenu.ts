import { ActionRow, ActionRowBuilder, APISelectMenuOption, ComponentType, MessageActionRowComponent, MessageActionRowComponentBuilder } from 'discord.js';

export function getDefaultOptionFromSelectMenu(
  components: (ActionRow<MessageActionRowComponent> | ActionRowBuilder<MessageActionRowComponentBuilder>)[],
) {
  let optionDefault: APISelectMenuOption | undefined;

  components.some(row =>
    row.components.some(element =>
      element.data.type === ComponentType.SelectMenu && element.data.options?.some(option =>
        option.default && (optionDefault = option))));

  return optionDefault;
}