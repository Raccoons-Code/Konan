import fetch from 'node-fetch';
import { GenresData, GenresOptions, ParseGenresOptions, SearchGenresOptions } from '../typings';

export default class Genres {
  apiKey: string;
  baseURL: string;
  movieGenres: Map<string, GenresData>;
  tvGenres: Map<string, GenresData>;
  language: string;

  constructor(options: GenresOptions) {
    this.apiKey = process.env.TMDB_APIKEY ?? options.apiKey;
    this.baseURL = `${options.baseURL}/genre`;
    this.language = options.language ?? 'en-US';

    this.movieGenres = new Map();
    this.tvGenres = new Map();
  }

  async fetchMovieGenres(props: SearchGenresOptions = {}): Promise<GenresData> {
    const { language = this.language } = props;

    if (this.movieGenres.has(language))
      return this.movieGenres.get(language) as GenresData;

    const fetchProps = [
      this.baseURL,
      '/movie/list?api_key=', this.apiKey,
      '&language=', language,
    ];

    const { genres } = await fetch(fetchProps.join('')).then(r => r.json());

    return this.movieGenres.set(language, { language, genres }).get(language) as GenresData;
  }

  async fetchTVGenres(props: SearchGenresOptions = {}): Promise<GenresData> {
    const { language = this.language } = props;

    if (this.tvGenres.has(language))
      return this.tvGenres.get(language) as GenresData;

    const fetchProps = [
      this.baseURL,
      '/tv/list?api_key=', this.apiKey,
      '&language=', language,
    ];

    const { genres } = await fetch(fetchProps.join('')).then(r => r.json());

    return this.tvGenres.set(language, { language, genres }).get(language) as GenresData;
  }

  async parseGenres(props: ParseGenresOptions) {
    const { genre_ids, language } = props;

    const { genres } = await this.fetchMovieGenres({ language });

    return genre_ids.map(genre_id => genres.find(genre => genre.id === genre_id)?.name);
  }
}