import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder } from 'discord.js';
import { MoviesCustomId } from '../../@types';
import { ButtonComponentInteraction } from '../../structures';
import TMDBApi, { APISearchMoviesResults, Util as TMDBUtil } from '../../TMDBAPI';

const { Primary, Secondary } = ButtonStyle;

export default class Movies extends ButtonComponentInteraction {
  constructor() {
    super({
      name: 'movies',
      description: 'Movies',
    });
  }

  async execute(interaction: ButtonInteraction) {
    const { customId, locale } = interaction;

    const { c, target } = <MoviesCustomId>JSON.parse(customId);

    const { offset, page } = this.getPage(target);

    const { results } = await TMDBApi.discover.fetchMovies({
      include_video: true,
      language: locale,
      page: page ? page : 1,
    });

    if (!results)
      return interaction.reply({ content: 'Sorry! I didn\'t find this page.', ephemeral: true });

    const { embeds } = await this.setEmbeds(results, offset, locale);

    const a = page > 1 ? true : offset;
    const b = target < 1000;

    const components = [
      new ActionRowBuilder<ButtonBuilder>()
        .setComponents([
          new ButtonBuilder()
            .setCustomId(JSON.stringify({ c, d: 0, o: offset, p: page, target: 1 }))
            .setDisabled(!a).setLabel('1...').setStyle(a ? Primary : Secondary),
          new ButtonBuilder()
            .setCustomId(JSON.stringify({ c, d: 1, o: offset, p: page, target: target - 1 }))
            .setDisabled(!a).setLabel('Back').setStyle(a ? Primary : Secondary),
          new ButtonBuilder()
            .setCustomId(JSON.stringify({ c, d: 2, o: offset, p: page }))
            .setDisabled(true).setLabel(`${target}`).setStyle(Secondary),
          new ButtonBuilder()
            .setCustomId(JSON.stringify({ c, d: 3, o: offset, p: page, target: target + 1 }))
            .setDisabled(!b).setLabel('Next').setStyle(b ? Primary : Secondary),
          new ButtonBuilder()
            .setCustomId(JSON.stringify({ c, d: 4, o: offset, p: page, target: 1000 }))
            .setDisabled(!b).setLabel('...1000').setStyle(b ? Primary : Secondary),
        ]),
    ];

    return interaction.update({ components, embeds });
  }

  getPage(raw_page = 1) {
    const page = Math.round((raw_page ?? 1) / 2) ?? 1;
    const offset = ((raw_page ?? 1) % 2) ? 0 : 1;
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

      embeds.push(new EmbedBuilder()
        .setAuthor({ name: genre_names.join(', ').slice(0, 256) })
        .setColor('Random')
        .setDescription(overview.slice(0, 4096))
        .setFields([
          { name: 'Release date', value: release_date || '-', inline: true },
          { name: 'Average of votes', value: `${vote_average ?? 0}`, inline: true },
          { name: 'Count of votes', value: `${vote_count ?? 0}`, inline: true },
          { name: 'Original language', value: lang || '-', inline: true },
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