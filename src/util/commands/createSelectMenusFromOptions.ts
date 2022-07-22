import { ActionRowBuilder, SelectMenuBuilder, SelectMenuOptionBuilder } from 'discord.js';
import splitArrayInGroups from '../splitArrayInGroups';

export function createSelectMenusFromOptions(options: SelectMenuOptionBuilder[], customId: CustomId) {
  return splitArrayInGroups(options, 25).map((group, i) =>
    new ActionRowBuilder<SelectMenuBuilder>()
      .setComponents(new SelectMenuBuilder()
        .setCustomId(JSON.stringify({
          d: i,
          ...customId,
        }))
        .setOptions(group)
        .setMaxValues(group.length)));
}

type CustomId = Record<any, any>