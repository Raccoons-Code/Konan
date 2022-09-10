import { ApplicationCommandOptionChoiceData, AutocompleteInteraction, SlashCommandBuilder } from 'discord.js';
import TMDBApi from '../../modules/TMDBApi';
import { SlashCommand } from '../../structures';

export default class Movies extends SlashCommand {
  [x: string]: any;

  constructor() {
    super({
      category: 'Fun',
    });

    this.data = new SlashCommandBuilder().setName('movies')
      .setDescription('Search, list and see details of movies.');
  }

  async execute(interaction: AutocompleteInteraction) {
    return this[`${interaction.options.getSubcommand()}Autocomplete`]?.(interaction);
  }

  async searchAutocomplete(interaction: AutocompleteInteraction, res: ApplicationCommandOptionChoiceData[] = []) {
    if (interaction.responded) return;

    const { locale, options } = interaction;

    const keyword = options.getString('keyword');

    if (!keyword) return interaction.respond(res);

    const { results } = await TMDBApi.search.searchMovie({ query: keyword, language: locale });

    for (let i = 0; i < results.length; i++) {
      const { id, title, vote_average } = results[i];

      const name = [
        vote_average, ' | ',
        title,
      ].join('').slice(0, 100);

      res.push({
        name,
        value: `${id}`,
      });

      if (res.length === 25) break;
    }

    return interaction.respond(res);
  }
}