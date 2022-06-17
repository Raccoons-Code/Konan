import axios from 'axios';
import { SearchMovieData, SearchMovieProps, SearchOptions } from '../@types';

export default class Search {
  apiKey: string;
  baseURL: string;
  include_adult: boolean;
  language: string;
  page: number;

  constructor(options: SearchOptions) {
    this.apiKey = options.apiKey ?? process.env.TMDB_APIKEY;
    this.baseURL = `${options.baseURL}/search`;
    this.include_adult = false;
    this.language = options.language ?? 'en-US';
    this.page = 1;
  }

  async searchMovie(props: SearchMovieProps): Promise<SearchMovieData> {
    const { include_adult = this.include_adult,
      language = this.language,
      page = this.page,
      primary_release_year,
      query,
      region,
      year } = props;

    return axios.get('/movie', {
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