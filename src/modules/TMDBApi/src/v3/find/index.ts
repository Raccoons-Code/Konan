import axios from 'axios';
import type { APIFindById, FindOptions, GetFindById } from '../@types';
import Routes from '../Routes';

export default class Find {
  apiKey: string;
  baseURL: string;
  language: string;

  constructor(options: FindOptions) {
    this.apiKey = options.apiKey ?? process.env.TMDB_APIKEY;
    this.baseURL = options.baseURL;
    this.language = options.language ?? 'en-US';
  }

  async findById(props: GetFindById): Promise<APIFindById> {
    const { external_id, external_source = 'imdb_id', language = this.language } = props;

    return axios.get(Routes.findById(external_id), {
      baseURL: this.baseURL,
      params: {
        api_key: this.apiKey,
        external_source,
        language,
      },
    }).then((r) => r.data);
  }
}