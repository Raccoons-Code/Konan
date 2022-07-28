import { ActionRow, ActionRowBuilder, APIActionRowComponent, APISelectMenuComponent, ComponentEmojiResolvable, ComponentType, MessageActionRowComponent, SelectMenuBuilder, SelectMenuOptionBuilder } from 'discord.js';
import Emoji from '../Emoji';
import { JSONparse } from './JSONparse';

export function setBitFieldValuesOnSelectMenus(
  components: ActionRow<MessageActionRowComponent>[],
  values: string[],
  customId: string,
  emojis: EmojisData = { Success: Emoji.Success, Danger: Emoji.Danger },
) {
  const { Danger = {}, Success = {} } = emojis;

  return components.map(component => {
    const componentJson = <APIActionRowComponent<APISelectMenuComponent>>component.toJSON();

    if (componentJson.components[0].type !== ComponentType.SelectMenu) return component;

    return new ActionRowBuilder<SelectMenuBuilder>()
      .setComponents(componentJson.components.map(element => {
        const newSelectMenu = new SelectMenuBuilder(element);

        if (element.custom_id !== customId) return newSelectMenu;

        return newSelectMenu.setOptions(element.options.map(option => {
          const value = JSONparse(option.value) ?? {};

          return new SelectMenuOptionBuilder(option)
            .setEmoji(values.includes(option.value) ? value.v ? Danger : Success : option.emoji ?? {})
            .setValue(JSON.stringify({
              ...value,
              v: values.includes(option.value) ? value.v ? 0 : 1 : value.v,
            }));
        }));
      }));
  });
}

export interface EmojisData {
  Success?: ComponentEmojiResolvable;
  Danger?: ComponentEmojiResolvable;
}