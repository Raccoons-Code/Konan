import axios from 'axios';
import { ESearchMoviesData, Movie, MoviesOptions, SearchDetailsOptions, SearchPopularOptions } from '../@types';

export default class Movies {
  apiKey: string;
  baseURL: string;
  language: string;

  constructor(options: MoviesOptions) {
    this.apiKey = process.env.TMDB_APIKEY ?? options.apiKey;
    this.baseURL = `${options.baseURL}/movie`;
    this.language = options.language || 'en-US';
  }

  async fetchDetails(props: SearchDetailsOptions): Promise<Movie> {
    const { append_to_response, movie_id, language = this.language } = props;

    return await axios.get(`/${movie_id}`, {
      baseURL: this.baseURL,
      params: {
        api_key: this.apiKey,
        language,
        append_to_response,
      },
    }).then(r => r.data);
  }

  async fetchLatest(props: { language?: string } = {}): Promise<Movie> {
    const { language = this.language } = props;

    return await axios.get('/latest', {
      baseURL: this.baseURL,
      params: {
        api_key: this.apiKey,
        language,
      },
    }).then(r => r.data);
  }

  async fetchNowPlaying(props: SearchPopularOptions = {}): Promise<ESearchMoviesData> {
    const { language = this.language, page = 1, region } = props;

    return await axios.get('/popular', {
      baseURL: this.baseURL,
      params: {
        api_key: this.apiKey,
        language,
        page,
        region,
      },
    }).then(r => r.data);
  }

  async fetchPopular(props: SearchPopularOptions = {}): Promise<ESearchMoviesData> {
    const { language = this.language, page = 1, region } = props;

    return await axios.get('/popular', {
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