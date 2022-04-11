import axios from 'axios';
import { ApiConfiguration, ConfigurationOptions, Countries, GetLanguageProps, Jobs, Languages, PrimaryTranslations, Timezones } from '../typings';

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
    this.apiKey = process.env.TMDB_APIKEY ?? options.apiKey;
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
    this.apiConfiguration = await this.fetchApiConfiguration();
    this.countries = await this.fetchCountries();
    this.jobs = await this.fetchJobs();
    this.languages = await this.fetchLanguages();
    this.primaryTranslations = await this.fetchPrimaryTranslations();
    this.timezones = await this.fetchTimezones();
  }

  async fetchApiConfiguration(): Promise<ApiConfiguration> {
    return await axios.get('', {
      baseURL: this.baseURL,
      params: { api_key: this.apiKey },
    }).then(r => r.data);
  }

  async fetchCountries(): Promise<Countries> {
    return await axios.get('/countries', {
      baseURL: this.baseURL,
      params: { api_key: this.apiKey },
    }).then(r => r.data);
  }

  async fetchJobs(): Promise<Jobs> {
    return await axios.get('/jobs', {
      baseURL: this.baseURL,
      params: { api_key: this.apiKey },
    }).then(r => r.data);
  }

  async fetchLanguages(): Promise<Languages> {
    return await axios.get('/languages', {
      baseURL: this.baseURL,
      params: { api_key: this.apiKey },
    }).then(r => r.data);
  }

  private async fetchPrimaryTranslations(): Promise<PrimaryTranslations> {
    return await axios.get('/primary_translations', {
      baseURL: this.baseURL,
      params: { api_key: this.apiKey },
    }).then(r => r.data);
  }

  async fetchTimezones(): Promise<Timezones> {
    return await axios.get('/timezones', {
      baseURL: this.baseURL,
      params: { api_key: this.apiKey },
    }).then(r => r.data);
  }
}