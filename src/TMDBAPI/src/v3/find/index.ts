import axios from 'axios';
import { FindData, FindOptions, FindProps } from '../@types';

export default class Find {
  apiKey: string;
  baseURL: string;
  language: string;

  constructor(options: FindOptions) {
    this.apiKey = options.apiKey ?? process.env.TMDB_APIKEY;
    this.baseURL = `${options.baseURL}/find`;
    this.language = options.language ?? 'en-US';
  }

  async findById(props: FindProps): Promise<FindData> {
    const { external_source, language = this.language } = props;

    return axios.get(`/${external_source}`, {
      baseURL: this.baseURL,
      params: {
        api_key: this.apiKey,
        language,
      },
    }).then((r) => r.data);
  }
}