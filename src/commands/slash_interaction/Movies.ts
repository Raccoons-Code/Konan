import { ActionRowBuilder, ApplicationCommandOptionChoiceData, AutocompleteInteraction, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import ms from 'ms';
import TMDBApi, { APISearchMoviesResults, SortType, SortTypes, Util as TMDBUtil } from '../../modules/TMDBApi';
import { SlashCommand } from '../../structures';

const { Primary, Secondary } = ButtonStyle;
const inline = true;

export default class Movies extends SlashCommand {
  [x: string]: any;

  constructor() {
    super({
      category: 'Fun',
    });

    this.data = new SlashCommandBuilder().setName('movies')
      .setDescription('Search, list and see details of movies.')
      .setNameLocalizations(this.getLocalizations('moviesName'))
      .setDescriptionLocalizations(this.getLocalizations('moviesDescription'))
      .addSubcommand(subcommand => subcommand.setName('list')
        .setDescription('List all movies.')
        .setNameLocalizations(this.getLocalizations('moviesListName'))
        .setDescriptionLocalizations(this.getLocalizations('moviesListDescription'))
        .addIntegerOption(option => option.setName('page')
          .setDescription('The page of the list.')
          .setNameLocalizations(this.getLocalizations('moviesListPageName'))
          .setDescriptionLocalizations(this.getLocalizations('moviesListPageDescription'))
          .setMinValue(1)
          .setMaxValue(1000))
        .addNumberOption(option => option.setName('sort')
          .setDescription('The sort order of the list.')
          .setChoices(...this.getChoicesFromEnum<number>(SortType))))
      .addSubcommand(subcommand => subcommand.setName('search')
        .setDescription('Search the movies.')
        .setNameLocalizations(this.getLocalizations('moviesSearchName'))
        .setDescriptionLocalizations(this.getLocalizations('moviesSearchDescription'))
        .addStringOption(option => option.setName('keyword')
          .setDescription('The keyword to search.')
          .setNameLocalizations(this.getLocalizations('moviesSearchKeywordName'))
          .setDescriptionLocalizations(this.getLocalizations('moviesSearchKeywordDescription'))
          .setAutocomplete(true)
          .setRequired(true)));
  }

  async execute(interaction: ChatInputCommandInteraction | AutocompleteInteraction) {
    const { options } = interaction;

    const subcommand = options.getSubcommand();

    if (interaction.isAutocomplete())
      return this[`${subcommand}Autocomplete`]?.(interaction);

    await interaction.deferReply({ ephemeral: true, fetchReply: true });

    return this[subcommand]?.(interaction);
  }

  async list(interaction: ChatInputCommandInteraction): Promise<any> {
    const { locale, options } = interaction;

    const raw_page = options.getInteger('page') ?? 1;
    const { offset, page } = this.getPage(raw_page);
    const s = options.getNumber('sort') ?? SortType['popularity.desc'];

    const { results } = await TMDBApi.discover.fetchMovies({
      include_video: true,
      language: locale,
      page,
      sort_by: <SortTypes>SortType[s],
    });

    if (!results)
      return interaction.editReply('Sorry! I didn\'t find your request.');

    const { embeds } = await this.setEmbeds(results, offset, locale);

    const a = page > 1 ? true : offset;
    const b = raw_page < 1000;

    const components = [
      new ActionRowBuilder<ButtonBuilder>()
        .setComponents([
          new ButtonBuilder()
            .setCustomId(JSON.stringify({ c: 'movies', d: 0, o: offset, p: page, s, target: 1 }))
            .setDisabled(!a).setLabel('1...').setStyle(a ? Primary : Secondary),
          new ButtonBuilder()
            .setCustomId(JSON.stringify({ c: 'movies', d: 1, o: offset, p: page, s, target: raw_page - 1 }))
            .setDisabled(!a).setLabel('<').setStyle(a ? Primary : Secondary),
          new ButtonBuilder()
            .setCustomId(JSON.stringify({ c: 'movies', d: 2, o: offset, p: page, s }))
            .setDisabled(true).setLabel(`${raw_page}`).setStyle(Secondary),
          new ButtonBuilder()
            .setCustomId(JSON.stringify({ c: 'movies', d: 3, o: offset, p: page, s, target: raw_page + 1 }))
            .setDisabled(!b).setLabel('>').setStyle(b ? Primary : Secondary),
          new ButtonBuilder()
            .setCustomId(JSON.stringify({ c: 'movies', d: 4, o: offset, p: page, s, target: 1000 }))
            .setDisabled(!b).setLabel(`...${1000}`).setStyle(b ? Primary : Secondary),
        ]),
    ];

    return interaction.editReply({ components, embeds });
  }

  async search(interaction: ChatInputCommandInteraction): Promise<any> {
    const { locale, options } = interaction;

    const movie_id = parseInt(options.getString('keyword', true));

    const { backdrop_path, budget, genres, id, original_language, original_title, overview, poster_path, release_date, revenue, runtime, title, vote_average, vote_count } = await TMDBApi.movies.fetchDetails({ movie_id, language: locale });

    const backdrop_img = TMDBUtil.image.imageURL({ path: backdrop_path! });

    const genre_names = genres.map(genre => genre.name);

    const movie_url = TMDBUtil.movie.movieURL(id);

    const poster_img = TMDBUtil.image.imageURL({ path: poster_path! });

    const lang = TMDBApi.configuration.getLanguage({ language: original_language });

    const numberFormat = Intl.NumberFormat(locale, { currency: 'USD', style: 'currency' });

    const dateFormat = new Intl.DateTimeFormat(locale, { timeZone: 'UTC' });

    const embeds = [
      new EmbedBuilder()
        .setAuthor({ name: genre_names.join(', ').slice(0, 256) })
        .setColor('Random')
        .setDescription(overview.slice(0, 4096) || null)
        .setFields([
          { name: 'Release date', value: release_date ? dateFormat.format(new Date(release_date)) : '-', inline },
          { name: 'Average of votes', value: `${vote_average ?? 0}`, inline },
          { name: 'Count of votes', value: `${vote_count ?? 0}`, inline },
          { name: 'Original language', value: lang || '-', inline },
          { name: 'Budget', value: numberFormat.format(budget), inline },
          { name: 'Revenue', value: numberFormat.format(revenue), inline },
          { name: 'Runtime', value: `${ms((runtime ?? 0) * 60000)}`, inline },
        ])
        .setImage(backdrop_img)
        .setThumbnail(poster_img)
        .setTitle(title || original_title)
        .setURL(movie_url),
    ];

    return interaction.editReply({ embeds });
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

  getPage(raw_page = 1) {
    const page = Math.round(raw_page / 2);
    const offset = (raw_page % 2) ? 0 : 1;
    return { offset, page };
  }

  async setEmbeds(results: APISearchMoviesResults[], offset = 0, locale = 'en-US') {
    const embeds = [];

    for (let i = (offset * 10); i < (offset * 10) + 10; i++) {
      const result = results[i];

      if (!result) continue;

      const { backdrop_path, genre_ids, id, original_title, original_language, overview, poster_path, release_date, title, vote_average, vote_count } = result;

      const backdrop_img = TMDBUtil.image.imageURL({ path: backdrop_path! });

      const genre_names = await TMDBApi.genres.parseMovieGenres({ genre_ids, language: locale });

      const movie_url = TMDBUtil.movie.movieURL(id);

      const poster_img = TMDBUtil.image.imageURL({ path: poster_path! });

      const lang = TMDBApi.configuration.getLanguage({ language: original_language });

      const dateFormat = new Intl.DateTimeFormat(locale, { timeZone: 'UTC' });

      embeds.push(new EmbedBuilder()
        .setAuthor(genre_names.length ? { name: genre_names.join(', ').slice(0, 256) } : null)
        .setColor('Random')
        .setDescription(overview.slice(0, 4096) || null)
        .setFields([
          { name: 'Release date', value: release_date ? dateFormat.format(new Date(release_date)) : '-', inline },
          { name: 'Average of votes', value: `${vote_average ?? 0}`, inline },
          { name: 'Count of votes', value: `${vote_count ?? 0}`, inline },
          { name: 'Original language', value: lang || '-', inline },
        ])
        .setImage(backdrop_img)
        .setThumbnail(poster_img)
        .setTitle(title || original_title)
        .setURL(movie_url),
      );
    }

    return { embeds };
  }
}