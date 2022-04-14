import axios from 'axios';
import { GenresData, GenresOptions, ParseGenresOptions, SearchGenresOptions } from '../@types';

export default class Genres {
  apiKey: string;
  baseURL: string;
  movieGenres: Map<string, GenresData>;
  tvGenres: Map<string, GenresData>;
  language: string;

  constructor(options: GenresOptions) {
    this.apiKey = process.env.TMDB_APIKEY ?? options.apiKey;
    this.baseURL = `${options.baseURL}/genre`;
    this.language = options.language || 'en-US';

    this.movieGenres = new Map();
    this.tvGenres = new Map();
  }

  async fetchMovieGenres(props: SearchGenresOptions = {}): Promise<GenresData> {
    const { language = this.language } = props;

    if (this.movieGenres.has(language))
      return this.movieGenres.get(language) as GenresData;

    const { genres } = await axios.get('/movie/list', {
      baseURL: this.baseURL,
      params: {
        api_key: this.apiKey,
        language,
      },
    }).then(r => r.data);

    return this.movieGenres.set(language, { language, genres }).get(language) as GenresData;
  }

  async fetchTVGenres(props: SearchGenresOptions = {}): Promise<GenresData> {
    const { language = this.language } = props;

    if (this.tvGenres.has(language))
      return this.tvGenres.get(language) as GenresData;

    const { genres } = await axios.get('/tv/list', {
      baseURL: this.baseURL,
      params: {
        api_key: this.apiKey,
        language,
      },
    }).then(r => r.data);

    return this.tvGenres.set(language, { language, genres }).get(language) as GenresData;
  }

  async parseGenres(props: ParseGenresOptions) {
    const { genre_ids, language } = props;

    const { genres } = await this.fetchMovieGenres({ language });

    return genre_ids.map(genre_id => genres.find(genre => genre.id === genre_id)?.name);
  }
}