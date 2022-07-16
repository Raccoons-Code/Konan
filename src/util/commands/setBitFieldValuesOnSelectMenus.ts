import { ActionRow, ActionRowBuilder, APIActionRowComponent, APISelectMenuComponent, ComponentType, MessageActionRowComponent, SelectMenuBuilder, SelectMenuOptionBuilder } from 'discord.js';
import { safeParseJSON } from './safeParseJSON';

export function setBitFieldValuesOnSelectMenus(
  components: ActionRow<MessageActionRowComponent>[],
  values: string[],
  customId: string,
) {
  return components.map(component => {
    const componentJson = <APIActionRowComponent<APISelectMenuComponent>>component.toJSON();

    if (componentJson.components[0].type !== ComponentType.SelectMenu) return component;

    return new ActionRowBuilder<SelectMenuBuilder>(componentJson)
      .setComponents(componentJson.components.map(element => {
        const newSelectMenu = new SelectMenuBuilder(element);

        if (element.custom_id !== customId) return newSelectMenu;

        return newSelectMenu.setOptions(element.options.map(option => {
          const value = safeParseJSON(option.value) || {};

          return new SelectMenuOptionBuilder(option)
            .setEmoji(values.includes(option.value) ? value.v ? '❌' : '✅' : option.emoji ?? {})
            .setValue(JSON.stringify({
              ...value,
              v: values.includes(option.value) ? value.v ? 0 : 1 : value.v,
            })).toJSON();
        }));
      }));
  }, []);
}