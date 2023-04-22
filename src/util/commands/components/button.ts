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

export function editButtonById(
  components: (
    | ActionRow<MessageActionRowComponent>
    | ActionRowBuilder<ButtonBuilder>
  )[],
  buttonId: string,
  options: {
    custom_id?: string | null
    disabled?: boolean | null
    emoji?: string | null
    name?: string | null
    style?: number | null
  },
) {
  if (!components?.length) return [];
  if (!buttonId) return components;

  return components.map(row => {
    const rowJson = <APIActionRowComponent<APIButtonComponentWithCustomId>>row.toJSON();

    if (!rowJson.components.length) return row;

    if (rowJson.components[0].type !== ComponentType.Button) return row;

    if (rowJson.components.every(button => button.custom_id !== buttonId)) return row;

    return new ActionRowBuilder<ButtonBuilder>()
      .addComponents(rowJson.components.map(button => {
        if (button.custom_id !== buttonId)
          return new ButtonBuilder(button);

        return new ButtonBuilder()
          .setCustomId(options.custom_id ?? buttonId)
          .setDisabled(options.disabled ?? button.disabled ?? false)
          .setEmoji(options.emoji ?? button.emoji ?? {})
          .setLabel(options.name ?? button.label ?? "")
          .setStyle(options.style ?? button.style);
      }));
  });
}

export function toggleButtons(
  components: (
    | ActionRow<MessageActionRowComponent>
    | ActionRowBuilder<MessageActionRowComponentBuilder>
  )[],
  customId: string | string[],
  disabled: boolean,
) {
  if (!Array.isArray(customId)) customId = [customId];

  return components.map(row => {
    const rowJson = <APIActionRowComponent<APIButtonComponentWithCustomId>>row.toJSON();

    if (rowJson.components.every(e => !customId.includes(e.custom_id))) return row;

    return new ActionRowBuilder<ButtonBuilder>()
      .addComponents(rowJson.components.map(button => {
        if (!customId.includes(button.custom_id))
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
