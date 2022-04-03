import axios from 'axios';
import { ESearchMoviesData, Movie, MoviesOptions, SearchDetailsOptions, SearchPopularOptions } from '../typings';

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

    const fetchProps = [
      '/', movie_id,
      '?api_key=', this.apiKey,
      '&language=', language,
      append_to_response ? `&append_to_response=${append_to_response}` : '',
    ];

    return await axios.get(fetchProps.join(''), { baseURL: this.baseURL }).then(r => r.data);
  }

  async fetchLatest(props: { language?: string } = {}): Promise<Movie> {
    const { language = this.language } = props;

    const fetchProps = [
      '/latest?api_key=', this.apiKey,
      '&language=', language,
    ];

    return await axios.get(fetchProps.join(''), { baseURL: this.baseURL }).then(r => r.data);
  }

  async fetchNowPlaying(props: SearchPopularOptions = {}): Promise<ESearchMoviesData> {
    const { language = this.language, page = 1, region } = props;

    const fetchProps = [
      '/popular?api_key=', this.apiKey,
      '&language=', language,
      '&page=', page,
      region ? `&region=${region}` : '',
    ];

    return await axios.get(fetchProps.join(''), { baseURL: this.baseURL }).then(r => r.data);
  }

  async fetchPopular(props: SearchPopularOptions = {}): Promise<ESearchMoviesData> {
    const { language = this.language, page = 1, region } = props;

    const fetchProps = [
      '/popular?api_key=', this.apiKey,
      '&language=', language,
      '&page=', page,
      region ? `&region=${region}` : '',
    ];

    return await axios.get(fetchProps.join(''), { baseURL: this.baseURL }).then(r => r.data);
  }
}