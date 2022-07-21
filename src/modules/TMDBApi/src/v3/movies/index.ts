import axios from 'axios';
import { APIMovieDetails, APINowPlaying, GetLatest, GetMovieDetails, GetNowPlaying, MoviesOptions } from '../@types';
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

    return axios.get(Routes.moviesDetails(movie_id), {
      baseURL: this.baseURL,
      params: {
        api_key: this.apiKey,
        language,
        append_to_response,
      },
    }).then(r => r.data);
  }

  async fetchLatest(props: GetLatest = {}): Promise<APIMovieDetails> {
    const { language = this.language } = props;

    return axios.get(Routes.moviesLatest(), {
      baseURL: this.baseURL,
      params: {
        api_key: this.apiKey,
        language,
      },
    }).then(r => r.data);
  }

  async fetchNowPlaying(props: GetNowPlaying = {}): Promise<APINowPlaying> {
    const { language = this.language, page = 1, region } = props;

    return axios.get(Routes.moviesNowPlaying(), {
      baseURL: this.baseURL,
      params: {
        api_key: this.apiKey,
        language,
        page,
        region,
      },
    }).then(r => r.data);
  }
}