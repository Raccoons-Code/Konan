import { ApplicationCommandOptionChoiceData, AutocompleteInteraction } from 'discord.js';
import { Memory } from '../../modules/Memory';
import { SlashAutocomplete } from '../../structures';

export default class MemoryGame extends SlashAutocomplete {
  constructor() {
    super({
      name: 'memory',
      description: 'Memory game.',
    });
  }

  async execute(interaction: AutocompleteInteraction, res: ApplicationCommandOptionChoiceData[] = []) {
    if (interaction.responded) return;

    const focused = interaction.options.getFocused(true);
    const pattern = RegExp(focused.value, 'i');

    if (focused.name === 'emojis') {
      const emojis = Object.entries(Memory.Emojis).filter(a => pattern.test(a[0]));

      for (let i = 0; i < emojis.length; i++) {
        const emoji = emojis[i];

        res.push({
          name: emoji[0],
          value: emoji[0],
        });
      }
    }

    return interaction.respond(res);
  }
}