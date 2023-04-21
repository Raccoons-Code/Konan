import { APIActionRowComponent, APIButtonComponentWithCustomId, ActionRow, ActionRowBuilder, ButtonBuilder, ComponentType, MessageActionRowComponent, MessageActionRowComponentBuilder } from "discord.js";
import { splitArrayInGroups } from "../../utils";

export function addButtonsToRows(
  components: (
    | ActionRow<MessageActionRowComponent>
    | ActionRowBuilder<ButtonBuilder>
  )[] = [],
  elements: ButtonBuilder[],
) {
  return components
    .map(row => {
      const rowJson = row.toJSON();

      if (!rowJson.components.length) return row;

      if (rowJson.components.length === 5) return row;

      if (rowJson.components[0].type !== ComponentType.Button) return row;

      return new ActionRowBuilder<ButtonBuilder>(rowJson)
        .addComponents(elements.splice(0, 5 - rowJson.components.length));
    }).concat(splitArrayInGroups(elements, 5)
      .map(buttons => new ActionRowBuilder<ButtonBuilder>()
        .addComponents(buttons)));
}

export function toggleButtons(
  components: (
    | ActionRow<MessageActionRowComponent>
    | ActionRowBuilder<MessageActionRowComponentBuilder>
  )[],
  customId: string,
  disabled: boolean,
) {
  return components.map(row => {
    const rowJson = <APIActionRowComponent<APIButtonComponentWithCustomId>>row.toJSON();

    if (rowJson.components.every(e => e.custom_id !== customId)) return row;

    return new ActionRowBuilder<ButtonBuilder>()
      .addComponents(rowJson.components.map(button => {
        if (button.custom_id !== customId)
          return new ButtonBuilder(button);

        return new ButtonBuilder({
          custom_id: button.custom_id,
          disabled: disabled,
          emoji: button.emoji,
          label: button.label,
          style: button.style,
        });
      }));
  });
}
