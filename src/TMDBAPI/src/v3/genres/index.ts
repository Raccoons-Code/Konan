import axios from 'axios';
import { GenresData, GenresOptions, ParseGenresOptions, SearchGenresProps } from '../@types';

export default class Genres {
  apiKey: string;
  baseURL: string;
  movieGenres: Map<string, GenresData> = new Map();
  tvGenres: Map<string, GenresData> = new Map();
  language: string;

  constructor(options: GenresOptions) {
    this.apiKey = options.apiKey ?? process.env.TMDB_APIKEY;
    this.baseURL = `${options.baseURL}/genre`;
    this.language = options.language || 'en-US';
  }

  async fetchMovieGenres(props: SearchGenresProps = {}): Promise<GenresData> {
    const { language = this.language } = props;

    if (this.movieGenres.has(language))
      return this.movieGenres.get(language)!;

    const { genres } = await axios.get('/movie/list', {
      baseURL: this.baseURL,
      params: {
        api_key: this.apiKey,
        language,
      },
    }).then(r => r.data);

    return this.movieGenres.set(language, { language, genres }).get(language)!;
  }

  async fetchTVGenres(props: SearchGenresProps = {}): Promise<GenresData> {
    const { language = this.language } = props;

    if (this.tvGenres.has(language))
      return this.tvGenres.get(language)!;

    const { genres } = await axios.get('/tv/list', {
      baseURL: this.baseURL,
      params: {
        api_key: this.apiKey,
        language,
      },
    }).then(r => r.data);

    return this.tvGenres.set(language, { language, genres }).get(language)!;
  }

  async parseGenres(props: ParseGenresOptions) {
    const { genre_ids, language } = props;

    const { genres } = await this.fetchMovieGenres({ language });

    return genre_ids.map(genre_id => genres.find(genre => genre.id === genre_id)?.name);
  }
}