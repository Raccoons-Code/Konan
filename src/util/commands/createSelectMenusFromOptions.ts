import { SelectMenuOptionBuilder } from '@discordjs/builders';
import { ActionRowBuilder, SelectMenuBuilder } from 'discord.js';
import splitArrayInGroups from '../splitArrayInGroups';

export function createSelectMenusFromOptions(options: SelectMenuOptionBuilder[], customId: CustomId) {
  return splitArrayInGroups(options.map(option => option.toJSON()), 25).map((group, i) =>
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