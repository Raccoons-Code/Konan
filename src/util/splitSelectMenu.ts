import { MessageSelectMenu, MessageSelectMenuOptions, MessageSelectOptionData } from 'discord.js';

export = (array: MessageSelectOptionData[], options: MessageSelectMenuOptions = {}) => {
  const { customId = 'customId' } = options;

  const groups = [];

  let customN = 0;

  for (let i = 0; i < array.length; i += 25) {
    const part = array.slice(i, (i + 25));

    groups.push(new MessageSelectMenu()
      .setOptions(part)
      .setCustomId(`${customId}_${customN}`));

    customN++;
  }

  return groups;
};