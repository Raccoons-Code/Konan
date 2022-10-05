import { request } from 'undici';
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

    return request(this.baseURL + Routes.findById(external_id), {
      query: {
        api_key: this.apiKey,
        external_source,
        language,
      },
    }).then(r => r.body.json());
  }
}