import { ActionRow, ActionRowBuilder, APIActionRowComponent, APIButtonComponent, ButtonBuilder, ComponentType, MessageActionRowComponent, MessageActionRowComponentBuilder } from 'discord.js';

export function reorganizeButtons(
  components: (ActionRow<MessageActionRowComponent> | ActionRowBuilder<MessageActionRowComponentBuilder>)[],
) {
  const buttons = components.reduce<APIButtonComponent[]>((acc, row) => {
    const rowJson = <APIActionRowComponent<APIButtonComponent>>row.toJSON();

    if (rowJson.components[0].type !== ComponentType.Button) return acc;

    return acc.concat(rowJson.components);
  }, []);

  return components.reduce((acc, row) => {
    const rowJson = <APIActionRowComponent<APIButtonComponent>>row.toJSON();

    if (rowJson.components[0].type !== ComponentType.Button) return acc.concat(row);
    if (!buttons.length) return acc;

    return acc.concat(new ActionRowBuilder<ButtonBuilder>()
      .setComponents(buttons.splice(0, 5).map(button => new ButtonBuilder(button))));
  }, <(ActionRow<MessageActionRowComponent> | ActionRowBuilder<MessageActionRowComponentBuilder>)[]>[]);
}