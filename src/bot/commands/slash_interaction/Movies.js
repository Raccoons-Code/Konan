const { SlashCommand } = require('../../classes');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { configuration, discover, genres, movies, search, util: TmdbUtils } = require('../../TMDBAPI');
const { image, movie } = TmdbUtils;
const ms = require('ms');

module.exports = class extends SlashCommand {
  constructor(client) {
    super(client);
    this.data = this.setName('movies')
      .setDescription('Search, list and see details of movies.')
      .addSubcommand(subcommand => subcommand.setName('list')
        .setDescription('List movies')
        .addIntegerOption(option => option.setName('page')
          .setDescription('Page')
          .setMinValue(1)
          .setMaxValue(1000))
        .addStringOption(option => option.setName('sort')
          .setDescription('Sort by...')
          .setChoices([
            ['Original title descending', 'original_title.desc'],
            ['Original title ascending', 'original_title.asc'],
            ['Popularity descending (default)', 'popularity.desc'],
            ['Popularity ascending', 'popularity.asc'],
            ['Primary release date descending', 'primary_release_date.desc'],
            ['Primary release date ascending', 'primary_release_date.asc'],
            ['Release date descending', 'release_date.desc'],
            ['Release date ascending', 'release_date.asc'],
            ['Revenue descending', 'revenue.desc'],
            ['Revenue ascending', 'revenue.asc'],
            ['Vote average descending', 'vote_average.desc'],
            ['Vote average ascending', 'vote_average.asc'],
            ['Vote count descending', 'vote_count.desc'],
            ['Vote count ascending', 'vote_count.asc'],
          ])))
      .addSubcommand(subcommand => subcommand.setName('search')
        .setDescription('Search movies')
        .addStringOption(option => option.setName('keyword')
          .setDescription('Search keyword')
          .setAutocomplete(true)
          .setRequired(true)));
  }

  async execute(interaction = this.CommandInteraction) {
    const { options } = interaction;

    const subcommand = options.getSubcommand();

    if (interaction.isAutocomplete())
      return await this[`${subcommand}Autocomplete`]?.(interaction);

    const { id } = await interaction.deferReply({ ephemeral: true, fetchReply: true });

    await this[subcommand]?.(interaction, id);
  }

  async list(interaction = this.CommandInteraction, id) {
    const { client, locale, options } = interaction;

    const sort_by = options.getString('sort');
    const raw_page = options.getInteger('page') || 1;
    const { offset, page } = this.getPage(raw_page);

    client.movies ? null : client.movies = {};

    const { results, total_pages, total_results } = await discover.fetchMovies({
      include_video: true,
      language: locale,
      page,
      sort_by,
    });

    if (!results)
      return await interaction.editReply('Sorry! I didn\'t find your request.');

    client.movies[id] = { sort_by };

    this.results = results;

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

  async search(interaction = this.CommandInteraction) {
    const { locale, options } = interaction;

    const movie_id = options.getString('keyword')?.split(' |')[0];

    const { adult, backdrop_path, belongs_to_collection, budget, genres, homepage, id, imdb_id, original_language, original_title, overview, popularity, poster_path, production_companies, production_countries, release_date, revenue, runtime, spoken_languages, status, tagline, title, video, vote_average, vote_count } = await movies.fetchDetails({ movie_id, language: locale });

    const backdrop_img = image.imageURL({ path: backdrop_path });

    const genre_names = genres.map(genre => genre.name);

    const movie_url = movie.movieURL({ id });

    const poster_img = image.imageURL({ path: poster_path });

    const lang = configuration.getLanguage({ language: original_language });

    const embeds = [new MessageEmbed()
      .setAuthor({ name: genre_names.join(', ') })
      .setColor('RANDOM')
      .setDescription(overview)
      .setFields([
        { name: 'Release date', value: release_date || '-', inline: true },
        { name: 'Average of votes', value: `${vote_average}`, inline: true },
        { name: 'Count of votes', value: `${vote_count}`, inline: true },
        { name: 'Original language', value: lang, inline: true },
        { name: 'Budget', value: `$${budget},00`, inline: true },
        { name: 'Revenue', value: `$${revenue},00`, inline: true },
        { name: 'Runtime', value: `${ms(runtime * 60000)}`, inline: true },
      ])
      .setImage(backdrop_img)
      .setThumbnail(poster_img)
      .setTitle(title || original_title)
      .setURL(movie_url)];

    await interaction.editReply({ embeds });
  }

  async searchAutocomplete(interaction = this.AutocompleteInteraction, res = []) {
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
        name: nameProps.join(' | ').match(this.limitRegex)[1],
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

  async setEmbeds(results = this.results, offset = 0, locale = 'en-US') {
    const embeds = [];

    for (let i = (offset * 10); i < (offset * 10) + 10; i++) {
      const result = results[i];

      if (!result) continue;

      const { adult, backdrop_path, genre_ids, id, original_title, original_language, overview, popularity, poster_path, release_date, title, video, vote_average, vote_count } = result;

      const backdrop_img = image.imageURL({ path: backdrop_path });

      const genre_names = await genres.parseGenres({ genre_ids, language: locale });

      const movie_url = movie.movieURL({ id });

      const poster_img = image.imageURL({ path: poster_path });

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
        .setTitle(title || original_title)
        .setURL(movie_url),
      );
    }

    return { embeds };
  }
};