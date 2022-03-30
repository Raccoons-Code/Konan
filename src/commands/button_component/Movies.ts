import { ButtonInteraction, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { ButtonComponentInteraction, Client } from '../../structures';
import tmdbApi, { ResultsMovieData } from '../../TMDBAPI';

const { configuration, discover, genres, Util: TmdbUtil } = tmdbApi;
const { image, movie } = TmdbUtil;

export default class Movies extends ButtonComponentInteraction {
  constructor(client: Client) {
    super(client, {
      name: 'movies',
      description: 'Movies',
    });
  }

  async execute(interaction: ButtonInteraction) {
    const { customId, locale } = interaction;

    const { c, target } = JSON.parse(customId) as MoviesCustomId;

    const { offset, page } = this.getPage(target);

    const { results } = await discover.fetchMovies({
      include_video: true,
      language: locale,
      page: page ? page : 1,
    });

    if (!results)
      return await interaction.reply({ content: 'Sorry! I didn\'t find this page.', ephemeral: true });

    const { embeds } = await this.setEmbeds(results, offset, locale);

    const a = page > 1 ? true : offset;
    const b = target < 1000;

    const components = [new MessageActionRow().setComponents([
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
    ])];

    await interaction.update({ components, embeds });
  }

  getPage(raw_page = 1) {
    const page = Math.round((raw_page ?? 1) / 2) ?? 1;
    const offset = ((raw_page ?? 1) % 2) ? 0 : 1;
    return { offset, page };
  }

  async setEmbeds(results: ResultsMovieData[], offset = 0, locale = 'en-US') {
    const embeds = [];

    for (let i = (offset * 10); i < (offset * 10) + 10; i++) {
      const result = results[i];

      if (!result) continue;

      const { backdrop_path, genre_ids, id, original_title, original_language, overview, poster_path, release_date, title, vote_average, vote_count } = result;

      const backdrop_img = image.imageURL({ path: backdrop_path as string });

      const genre_names = await genres.parseGenres({ genre_ids, language: locale });

      const movie_url = movie.movieURL({ id });

      const poster_img = image.imageURL({ path: poster_path as string });

      const lang = configuration.getLanguage({ language: original_language });

      embeds.push(new MessageEmbed()
        .setAuthor({ name: genre_names.join(', ') })
        .setColor('RANDOM')
        .setDescription(overview)
        .setFields([
          { name: 'Release date', value: release_date ?? '-', inline: true },
          { name: 'Average of votes', value: `${vote_average ?? '0'}`, inline: true },
          { name: 'Count of votes', value: `${vote_count ?? '0'}`, inline: true },
          { name: 'Original language', value: lang ?? '-', inline: true },
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

export interface MoviesCustomId {
  /** command */
  c: string
  d: number
  /** offset */
  o: number
  /** page */
  p: number
  target: number
}