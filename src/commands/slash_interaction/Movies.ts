import { SlashCommandBuilder } from '@discordjs/builders';
import { ApplicationCommandOptionChoice, AutocompleteInteraction, CommandInteraction, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import ms from 'ms';
import { Client, SlashCommand } from '../../structures';
import tmdbApi from '../../TMDBAPI';
import { SearchMoviesData } from '../../TMDBAPI/src/v3/typings';

const { NumberFormat } = Intl;
const { configuration, discover, genres, movies, search, Util: TmdbUtil } = tmdbApi;
const { image, movie } = TmdbUtil;

export default class Movies extends SlashCommand {
  [k: string]: any

  constructor(client: Client) {
    super(client, {
      category: 'Fun',
    });

    this.data = new SlashCommandBuilder().setName('movies')
      .setDescription('Search, list and see details of movies.')
      .addSubcommand(subcommand => subcommand.setName('list')
        .setDescription('List movies.')
        .addIntegerOption(option => option.setName('page')
          .setDescription('Page number.')
          .setMinValue(1)
          .setMaxValue(1000)))
      .addSubcommand(subcommand => subcommand.setName('search')
        .setDescription('Search movies.')
        .addStringOption(option => option.setName('keyword')
          .setDescription('Search keyword.')
          .setAutocomplete(true)
          .setRequired(true)));
  }

  async execute(interaction: CommandInteraction | AutocompleteInteraction) {
    const { options } = interaction;

    const subcommand = options.getSubcommand();

    if (interaction.isAutocomplete())
      return await this[`${subcommand}Autocomplete`]?.(interaction);

    await interaction.deferReply({ ephemeral: true, fetchReply: true });

    await this[subcommand]?.(interaction);
  }

  async list(interaction: CommandInteraction): Promise<any> {
    const { locale, options } = interaction;

    const raw_page = options.getInteger('page') ?? 1;
    const { offset, page } = this.getPage(raw_page);

    const { results } = await discover.fetchMovies({
      include_video: true,
      language: locale,
      page,
    });

    if (!results)
      return await interaction.editReply('Sorry! I didn\'t find your request.');

    const { embeds } = await this.setEmbeds(results, offset, locale);

    const a = page > 1 ? true : offset;
    const b = raw_page < 1000;

    const buttons = [
      new MessageButton().setLabel('1...').setStyle(a ? 'PRIMARY' : 'SECONDARY').setDisabled(!a)
        .setCustomId(JSON.stringify({ c: this.data.name, d: 0, o: offset, p: page, target: 1 })),
      new MessageButton().setLabel('Back').setStyle(a ? 'PRIMARY' : 'SECONDARY').setDisabled(!a)
        .setCustomId(JSON.stringify({ c: this.data.name, d: 1, o: offset, p: page, target: raw_page - 1 })),
      new MessageButton().setLabel(`${raw_page}`).setStyle('SECONDARY').setDisabled(true)
        .setCustomId(JSON.stringify({ c: this.data.name, d: 2, o: offset, p: page })),
      new MessageButton().setLabel('Next').setStyle(b ? 'PRIMARY' : 'SECONDARY').setDisabled(!b)
        .setCustomId(JSON.stringify({ c: this.data.name, d: 3, o: offset, p: page, target: raw_page + 1 })),
      new MessageButton().setLabel(`...${1000}`).setStyle(b ? 'PRIMARY' : 'SECONDARY').setDisabled(!b)
        .setCustomId(JSON.stringify({ c: this.data.name, d: 4, o: offset, p: page, target: 1000 })),
    ];

    const components = [new MessageActionRow().setComponents(buttons)];

    await interaction.editReply({ components, embeds });
  }

  async search(interaction: CommandInteraction) {
    const { locale, options } = interaction;

    const movie_id = parseInt(<string>options.getString('keyword')?.split(' |')[0]);

    const { backdrop_path, budget, genres: _genres, id, original_language, original_title, overview, poster_path, release_date, revenue, runtime, title, vote_average, vote_count } = await movies.fetchDetails({ movie_id, language: locale });

    const backdrop_img = image.imageURL({ path: <string>backdrop_path });

    const genre_names = _genres.map(genre => genre.name);

    const movie_url = movie.movieURL({ id });

    const poster_img = image.imageURL({ path: <string>poster_path });

    const lang = configuration.getLanguage({ language: original_language });

    const numberFormat = NumberFormat(locale, { currency: 'USD', style: 'currency' });

    const embeds = [new MessageEmbed()
      .setAuthor({ name: genre_names.join(', ') })
      .setColor('RANDOM')
      .setDescription(overview)
      .setFields([
        { name: 'Release date', value: release_date || '-', inline: true },
        { name: 'Average of votes', value: `${vote_average ?? 0}`, inline: true },
        { name: 'Count of votes', value: `${vote_count ?? 0}`, inline: true },
        { name: 'Original language', value: lang || '-', inline: true },
        { name: 'Budget', value: numberFormat.format(budget), inline: true },
        { name: 'Revenue', value: numberFormat.format(revenue), inline: true },
        { name: 'Runtime', value: `${ms((runtime ?? 0) * 60000)}`, inline: true },
      ])
      .setImage(backdrop_img)
      .setThumbnail(poster_img)
      .setTitle(title ?? original_title)
      .setURL(movie_url)];

    await interaction.editReply({ embeds });
  }

  async searchAutocomplete(interaction: AutocompleteInteraction, res: ApplicationCommandOptionChoice[] = []) {
    if (interaction.responded) return;

    const { locale, options } = interaction;

    const keyword = options.getString('keyword');

    if (!keyword) return await interaction.respond(res);

    const { results } = await search.searchMovies({ query: keyword, language: locale });

    for (let i = 0; i < results.length; i++) {
      const { id, title, vote_average } = results[i];

      const nameProps = [
        id,
        vote_average,
        title,
      ];

      res.push({
        name: `${nameProps.join(' | ').trim().match(this.pattern.label)?.[1]}`,
        value: `${id}`,
      });

      if (i === 24) break;
    }

    await interaction.respond(res);
  }

  getPage(raw_page = 1) {
    const page = Math.round(raw_page / 2);
    const offset = (raw_page % 2) ? 0 : 1;
    return { offset, page };
  }

  async setEmbeds(results: SearchMoviesData['results'], offset = 0, locale = 'en-US') {
    const embeds = [];

    for (let i = (offset * 10); i < (offset * 10) + 10; i++) {
      const result = results[i];

      if (!result) continue;

      const { backdrop_path, genre_ids, id, original_title, original_language, overview, poster_path, release_date, title, vote_average, vote_count } = result;

      const backdrop_img = image.imageURL({ path: <string>backdrop_path });

      const genre_names = await genres.parseGenres({ genre_ids, language: locale });

      const movie_url = movie.movieURL({ id });

      const poster_img = image.imageURL({ path: <string>poster_path });

      const lang = configuration.getLanguage({ language: original_language });

      embeds.push(new MessageEmbed()
        .setAuthor({ name: genre_names.join(', ') })
        .setColor('RANDOM')
        .setDescription(overview)
        .setFields([
          { name: 'Release date', value: release_date, inline: true },
          { name: 'Average of votes', value: `${vote_average}`, inline: true },
          { name: 'Count of votes', value: `${vote_count}`, inline: true },
          { name: 'Original language', value: lang, inline: true },
        ])
        .setImage(backdrop_img)
        .setThumbnail(poster_img)
        .setTitle(title ?? original_title)
        .setURL(movie_url),
      );
    }

    return { embeds };
  }
}