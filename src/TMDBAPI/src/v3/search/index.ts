import axios from 'axios';
import { SearchMoviesData, SearchOptions, SearchQueryOptions } from '../typings';

export default class Search {
  apiKey: string;
  baseURL: string;
  include_adult: boolean;
  language: string;
  page: number;

  constructor(options: SearchOptions) {
    this.apiKey = process.env.TMDB_APIKEY ?? options.apiKey;
    this.baseURL = `${options.baseURL}/search`;
    this.include_adult = false;
    this.language = options.language || 'en-US';
    this.page = 1;
  }

  async searchMovies(props: SearchQueryOptions): Promise<SearchMoviesData> {
    const { include_adult = this.include_adult,
      language = this.language,
      page = this.page,
      primary_release_year,
      query,
      region,
      year } = props;

    return await axios.get('/movie', {
      baseURL: this.baseURL,
      params: {
        api_key: this.apiKey,
        query,
        language,
        page,
        include_adult,
        primary_release_year,
        region,
        year,
      },
    }).then(r => r.data);
  }
}