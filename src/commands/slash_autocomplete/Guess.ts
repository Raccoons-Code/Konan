import { ApplicationCommandOptionChoiceData, AutocompleteInteraction, SlashCommandBuilder } from 'discord.js';
import { QuickDB } from 'quick.db';
import type { GuessGameData } from '../../@types';
import { SlashCommand } from '../../structures';

const quickDb = new QuickDB();

export default class Guess extends SlashCommand {
  constructor() {
    super({
      category: 'Game',
    });

    this.data = new SlashCommandBuilder().setName('guess')
      .setDescription('You have 10 chances to guess the number from 1 to 100 that the bot set.');
  }

  async execute(interaction: AutocompleteInteraction) {
    return this.executeAutocomplete(interaction);
  }

  async executeAutocomplete(interaction: AutocompleteInteraction, res: ApplicationCommandOptionChoiceData[] = []) {
    if (interaction.responded) return;

    const { guildId, options, user } = interaction;

    const value = options.getFocused();
    const pattern = RegExp(`${value}`);

    const guess = await quickDb.get<GuessGameData>(`${guildId}.${user.id}.guess`);

    for (let i = 1; i < 101; i++) {
      if (guess?.user?.includes(i)) continue;

      if (pattern.test(`${i}`))
        res.push({
          name: `${i}`,
          value: i,
        });

      if (res.length === 25) break;
    }

    return interaction.respond(res);
  }
}