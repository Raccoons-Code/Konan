import { request } from 'undici';
import type { APIMovieDetails, APINowPlaying, GetLatest, GetMovieDetails, GetNowPlaying, MoviesOptions } from '../@types';
import Routes from '../Routes';

export default class Movies {
  apiKey: string;
  baseURL: string;
  language: string;

  constructor(options: MoviesOptions) {
    this.apiKey = options.apiKey ?? process.env.TMDB_APIKEY;
    this.baseURL = options.baseURL;
    this.language = options.language ?? 'en-US';
  }

  async fetchDetails(props: GetMovieDetails): Promise<APIMovieDetails> {
    const { append_to_response, movie_id, language = this.language } = props;

    return request(this.baseURL + Routes.moviesDetails(movie_id), {
      query: {
        api_key: this.apiKey,
        language,
        append_to_response,
      },
    }).then(r => r.body.json());
  }

  async fetchLatest(props: GetLatest = {}): Promise<APIMovieDetails> {
    const { language = this.language } = props;

    return request(this.baseURL + Routes.moviesLatest(), {
      query: {
        api_key: this.apiKey,
        language,
      },
    }).then(r => r.body.json());
  }

  async fetchNowPlaying(props: GetNowPlaying = {}): Promise<APINowPlaying> {
    const { language = this.language, page = 1, region } = props;

    return request(this.baseURL + Routes.moviesNowPlaying(), {
      query: {
        api_key: this.apiKey,
        language,
        page,
        region,
      },
    }).then(r => r.body.json());
  }
}