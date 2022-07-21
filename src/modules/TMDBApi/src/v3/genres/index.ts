import axios from 'axios';
import { APIGenre, GenresData, GenresOptions, ParseGenresOptions, GetGenres } from '../@types';
import Routes from '../Routes';

export default class Genres {
  apiKey: string;
  baseURL: string;
  movieGenres = new Map<string, GenresData>();
  tvGenres = new Map<string, GenresData>();
  language: string;

  constructor(options: GenresOptions) {
    this.apiKey = options.apiKey ?? process.env.TMDB_APIKEY;
    this.baseURL = options.baseURL;
    this.language = options.language || 'en-US';
  }

  async fetchMovieGenres(props: GetGenres = {}): Promise<GenresData> {
    const { language = this.language } = props;

    if (this.movieGenres.has(language))
      return this.movieGenres.get(language)!;

    const { genres } = await axios.get(Routes.genresMovieList(), {
      baseURL: this.baseURL,
      params: {
        api_key: this.apiKey,
        language,
      },
    }).then(r => r.data);

    return this.movieGenres.set(language, { language, genres }).get(language)!;
  }

  async fetchTVGenres(props: GetGenres = {}): Promise<GenresData> {
    const { language = this.language } = props;

    if (this.tvGenres.has(language))
      return this.tvGenres.get(language)!;

    const { genres } = await axios.get(Routes.genresTvList(), {
      baseURL: this.baseURL,
      params: {
        api_key: this.apiKey,
        language,
      },
    }).then(r => r.data);

    return this.tvGenres.set(language, { language, genres }).get(language)!;
  }

  parseGenres({ genre_ids, genres }: { genre_ids: number[], genres: APIGenre[] }) {
    return genre_ids.map(genre_id => genres.find(genre => genre.id === genre_id)?.name);
  }

  async parseMovieGenres(props: ParseGenresOptions) {
    const { genre_ids, language } = props;

    const { genres } = await this.fetchMovieGenres({ language });

    return this.parseGenres({ genre_ids, genres });
  }

  async parseTVGenres(props: ParseGenresOptions) {
    const { genre_ids, language } = props;

    const { genres } = await this.fetchTVGenres({ language });

    return this.parseGenres({ genre_ids, genres });
  }
}