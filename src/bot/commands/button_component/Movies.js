const { ButtonInteraction } = require('../../classes');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { configuration, discover, genres, movies, search, util: TmdbUtils } = require('../../TMDBAPI');
const { image, movie } = TmdbUtils;
const ms = require('ms');

module.exports = class extends ButtonInteraction {
  constructor(...args) {
    super(...args);
    this.data = {
      name: 'movies',
      description: 'Movies',
    };
  }

  async execute(interaction = this.ButtonInteraction) {
    const { client, component, customId, locale, message } = interaction;

    /** @type {customId} */
    const { d, c, p, o, target } = this.util.parseJSON(customId);

    console.log(target);

    const { offset, page } = this.getPage(target);

    const { sort_by } = client.movies?.[message.id] || {};

    const { results, total_pages, total_results } = await discover.fetchMovies({
      include_video: true,
      language: locale,
      page: page ? page : 1,
      sort_by,
    });

    this.results = results;

    const { embeds } = await this.setEmbeds(results, offset, locale);

    const a = page > 1 ? true : offset;
    const b = target < 1000;

    const buttons = [
      new MessageButton().setLabel('1...').setStyle(a ? 'PRIMARY' : 'SECONDARY').setDisabled(!a)
        .setCustomId(JSON.stringify({ c, d: 0, o: offset, p: page, target: 1 })),
      new MessageButton().setLabel('Back').setStyle(a ? 'PRIMARY' : 'SECONDARY').setDisabled(!a)
        .setCustomId(JSON.stringify({ c, d: 1, o: offset, p: page, target: target - 1 })),
      new MessageButton().setLabel(`${target}`).setStyle('SECONDARY').setDisabled(true)
        .setCustomId(JSON.stringify({ c, d: 2, o: offset, p: page })),
      new MessageButton().setLabel('Next').setStyle(b ? 'PRIMARY' : 'SECONDARY').setDisabled(!b)
        .setCustomId(JSON.stringify({ c, d: 3, o: offset, p: page, target: target + 1 })),
      new MessageButton().setLabel(`...${1000}`).setStyle(b ? 'PRIMARY' : 'SECONDARY').setDisabled(!b)
        .setCustomId(JSON.stringify({ c, d: 4, o: offset, p: page, target: 1000 })),
    ];

    const components = [new MessageActionRow().setComponents(buttons)];

    await interaction.update({ components, embeds });
  }

  getPage(raw_page = 1) {
    const page = Math.round((raw_page || 1) / 2) || 1;
    const offset = ((raw_page || 1) % 2) ? 0 : 1;
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

/**
 * @typedef customId
 * @property {string} c command
 * @property {number} d
 * @property {number} o offset
 * @property {number} p page
 * @property {number} target
 */