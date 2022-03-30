import fetch from 'node-fetch';
import { ApiConfiguration, ConfigurationOpitons, Countries, GetLanguageProps, Jobs, Languages, PrimaryTranslations, Timezones } from '../typings';

export default class Configuration {
  apiKey: string;
  baseURL: string;
  apiConfiguration!: ApiConfiguration;
  countries!: Countries;
  jobs!: Jobs;
  languages!: Languages;
  primaryTranslations!: PrimaryTranslations;
  timezones!: Timezones;

  constructor(options: ConfigurationOpitons) {
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
    const fetchProps = [
      this.baseURL,
      '?api_key=', this.apiKey,
    ];

    return await fetch(fetchProps.join('')).then(r => r.json());
  }

  async fetchCountries(): Promise<Countries> {
    const fetchProps = [
      this.baseURL,
      '/countries?api_key=', this.apiKey,
    ];

    return await fetch(fetchProps.join('')).then(r => r.json());
  }

  async fetchJobs(): Promise<Jobs> {
    const fetchProps = [
      this.baseURL,
      '/jobs?api_key=', this.apiKey,
    ];

    return await fetch(fetchProps.join('')).then(r => r.json());
  }

  async fetchLanguages(): Promise<Languages> {
    const fetchProps = [
      this.baseURL,
      '/languages?api_key=', this.apiKey,
    ];

    return await fetch(fetchProps.join('')).then(r => r.json());
  }

  private async fetchPrimaryTranslations(): Promise<PrimaryTranslations> {
    const fetchProps = [
      this.baseURL,
      '/primary_translations?api_key=', this.apiKey,
    ];

    return await fetch(fetchProps.join('')).then(r => r.json());
  }

  async fetchTimezones(): Promise<Timezones> {
    const fetchProps = [
      this.baseURL,
      '/timezones?api_key=', this.apiKey,
    ];

    return await fetch(fetchProps.join('')).then(r => r.json());
  }
}