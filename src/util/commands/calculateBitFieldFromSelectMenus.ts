import { ActionRow, ActionRowBuilder, APIActionRowComponent, APISelectMenuComponent, ComponentType, MessageActionRowComponent, SelectMenuBuilder } from 'discord.js';
import { JSONparse } from './JSONparse';

export function calculateBitFieldFromSelectMenus(
  components: (ActionRow<MessageActionRowComponent> | ActionRowBuilder<SelectMenuBuilder>)[],
) {
  return components.reduce((acc, component) => {
    const componentJson = <APIActionRowComponent<APISelectMenuComponent>>component.toJSON();

    if (componentJson.components[0].type !== ComponentType.SelectMenu) return acc;

    return acc + componentJson.components.reduce((acc2, element) => {
      return acc2 + element.options.reduce((acc3, option) => {
        const value = JSONparse(option.value) || {};

        if (value.v) return acc3 | BigInt(value.n);

        return acc3;
      }, 0n);
    }, 0n);
  }, 0n);
}