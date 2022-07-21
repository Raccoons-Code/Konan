import axios from 'axios';
import { APISearchMovies, GetSearchMovies, SearchOptions } from '../@types';
import Routes from '../Routes';

export default class Search {
  apiKey: string;
  baseURL: string;
  include_adult: boolean;
  language: string;
  page: number;

  constructor(options: SearchOptions) {
    this.apiKey = options.apiKey ?? process.env.TMDB_APIKEY;
    this.baseURL = options.baseURL;
    this.include_adult = options.include_adult ?? false;
    this.language = options.language ?? 'en-US';
    this.page = options.page ?? 1;
  }

  async searchMovie(props: GetSearchMovies): Promise<APISearchMovies> {
    const { include_adult = this.include_adult,
      language = this.language,
      page = this.page,
      primary_release_year,
      query,
      region,
      year } = props;

    return axios.get(Routes.searchMovies(), {
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