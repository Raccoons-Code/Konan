import axios from 'axios';
import { APIConfiguration, APICountries, APIJobs, APILanguages, APIPrimaryTranslations, APITimezones, ConfigurationOptions, GetLanguageProps } from '../@types';
import Routes from '../Routes';

export default class Configuration {
  apiKey: string;
  baseURL: string;
  apiConfiguration!: APIConfiguration;
  countries!: APICountries;
  jobs!: APIJobs;
  languages!: APILanguages;
  primaryTranslations!: APIPrimaryTranslations;
  timezones!: APITimezones;

  constructor(options: ConfigurationOptions) {
    this.apiKey = options.apiKey ?? process.env.TMDB_APIKEY;
    this.baseURL = options.baseURL;

    this.fetchConfiguration();
  }

  getLanguage(props: GetLanguageProps) {
    const { language: original_language } = props;

    const lang = this.languages?.find(language => language.iso_639_1 === original_language);

    let language = lang?.name ?? lang?.english_name ?? lang?.iso_639_1 ?? original_language;

    language = original_language !== 'en' ? lang?.name ?
      `${language} (${lang?.english_name})` : language : language;

    return language;
  }

  private async fetchConfiguration() {
    Promise.all([
      this.fetchApiConfiguration(),
      this.fetchCountries(),
      this.fetchJobs(),
      this.fetchLanguages(),
      this.fetchPrimaryTranslations(),
      this.fetchTimezones(),
    ]).then(results => {
      this.apiConfiguration = results[0];
      this.countries = results[1];
      this.jobs = results[2];
      this.languages = results[3];
      this.primaryTranslations = results[4];
      this.timezones = results[5];
    }).catch(() => null);
  }

  async fetchApiConfiguration(): Promise<APIConfiguration> {
    return axios.get(Routes.configurationApi(), {
      baseURL: this.baseURL,
      params: { api_key: this.apiKey },
    }).then(r => r.data);
  }

  async fetchCountries(): Promise<APICountries> {
    return axios.get(Routes.configurationCountries(), {
      baseURL: this.baseURL,
      params: { api_key: this.apiKey },
    }).then(r => r.data);
  }

  async fetchJobs(): Promise<APIJobs> {
    return axios.get(Routes.configurationJobs(), {
      baseURL: this.baseURL,
      params: { api_key: this.apiKey },
    }).then(r => r.data);
  }

  async fetchLanguages(): Promise<APILanguages> {
    return axios.get(Routes.configurationLanguages(), {
      baseURL: this.baseURL,
      params: { api_key: this.apiKey },
    }).then(r => r.data);
  }

  private async fetchPrimaryTranslations(): Promise<APIPrimaryTranslations> {
    return axios.get(Routes.configurationPrimaryTranslations(), {
      baseURL: this.baseURL,
      params: { api_key: this.apiKey },
    }).then(r => r.data);
  }

  async fetchTimezones(): Promise<APITimezones> {
    return axios.get(Routes.configurationTimezones(), {
      baseURL: this.baseURL,
      params: { api_key: this.apiKey },
    }).then(r => r.data);
  }
}