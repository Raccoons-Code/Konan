import { ActionRowBuilder, APISelectMenuOption, SelectMenuBuilder, SelectMenuComponentOptionData, SelectMenuOptionBuilder } from 'discord.js';
import splitArrayInGroups from '../splitArrayInGroups';

export function createSelectMenuFromOptions(
  options: (APISelectMenuOption | SelectMenuComponentOptionData | SelectMenuOptionBuilder)[],
  customId: CustomId,
) {
  let index = 1;

  return splitArrayInGroups(options, 25).map(group =>
    new ActionRowBuilder<SelectMenuBuilder>()
      .setComponents(new SelectMenuBuilder()
        .setCustomId(JSON.stringify({
          d: index++ && Date.now() + index,
          ...customId,
        }))
        .setOptions(group)
        .setMaxValues(group.length)));
}

type CustomId = Record<any, any>