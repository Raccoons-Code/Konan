import axios from 'axios';
import { ApiConfiguration, ConfigurationOptions, Countries, GetLanguageProps, Jobs, Languages, PrimaryTranslations, Timezones } from '../@types';

export default class Configuration {
  apiKey: string;
  baseURL: string;
  apiConfiguration!: ApiConfiguration;
  countries!: Countries;
  jobs!: Jobs;
  languages!: Languages;
  primaryTranslations!: PrimaryTranslations;
  timezones!: Timezones;

  constructor(options: ConfigurationOptions) {
    this.apiKey = options.apiKey ?? process.env.TMDB_APIKEY;
    this.baseURL = `${options.baseURL}/configuration`;

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
    });
  }

  async fetchApiConfiguration(): Promise<ApiConfiguration> {
    return axios.get('', {
      baseURL: this.baseURL,
      params: { api_key: this.apiKey },
    }).then(r => r.data);
  }

  async fetchCountries(): Promise<Countries> {
    return axios.get('/countries', {
      baseURL: this.baseURL,
      params: { api_key: this.apiKey },
    }).then(r => r.data);
  }

  async fetchJobs(): Promise<Jobs> {
    return axios.get('/jobs', {
      baseURL: this.baseURL,
      params: { api_key: this.apiKey },
    }).then(r => r.data);
  }

  async fetchLanguages(): Promise<Languages> {
    return axios.get('/languages', {
      baseURL: this.baseURL,
      params: { api_key: this.apiKey },
    }).then(r => r.data);
  }

  private async fetchPrimaryTranslations(): Promise<PrimaryTranslations> {
    return axios.get('/primary_translations', {
      baseURL: this.baseURL,
      params: { api_key: this.apiKey },
    }).then(r => r.data);
  }

  async fetchTimezones(): Promise<Timezones> {
    return axios.get('/timezones', {
      baseURL: this.baseURL,
      params: { api_key: this.apiKey },
    }).then(r => r.data);
  }
}