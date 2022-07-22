import { ButtonBuilder } from '@discordjs/builders';
import { ActionRow, ActionRowBuilder, APIActionRowComponent, APIButtonComponent, ComponentType, MessageActionRowComponent, MessageActionRowComponentBuilder } from 'discord.js';

export function reorganizeButtonRoles(
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
      .setComponents(buttons.splice(0, 5).map(element => new ButtonBuilder(element))));
  }, <(ActionRow<MessageActionRowComponent> | ActionRowBuilder<MessageActionRowComponentBuilder>)[]>[]);
}