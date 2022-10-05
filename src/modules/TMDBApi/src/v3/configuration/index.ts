import { request } from 'undici';
import type { APIConfiguration, APICountries, APIJobs, APILanguages, APIPrimaryTranslations, APITimezones, ConfigurationOptions, GetLanguageProps } from '../@types';
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

    language = !['en', 'xx'].includes(original_language) ? lang?.name ?
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
    return request(this.baseURL + Routes.configurationApi(), {
      query: {
        api_key: this.apiKey,
      },
    }).then(r => r.body.json());
  }

  async fetchCountries(): Promise<APICountries> {
    return request(this.baseURL + Routes.configurationCountries(), {
      query: {
        api_key: this.apiKey,
      },
    }).then(r => r.body.json());
  }

  async fetchJobs(): Promise<APIJobs> {
    return request(this.baseURL + Routes.configurationJobs(), {
      query: {
        api_key: this.apiKey,
      },
    }).then(r => r.body.json());
  }

  async fetchLanguages(): Promise<APILanguages> {
    return request(this.baseURL + Routes.configurationLanguages(), {
      query: {
        api_key: this.apiKey,
      },
    }).then(r => r.body.json());
  }

  private async fetchPrimaryTranslations(): Promise<APIPrimaryTranslations> {
    return request(this.baseURL + Routes.configurationPrimaryTranslations(), {
      query: {
        api_key: this.apiKey,
      },
    }).then(r => r.body.json());
  }

  async fetchTimezones(): Promise<APITimezones> {
    return request(this.baseURL + Routes.configurationTimezones(), {
      query: {
        api_key: this.apiKey,
      },
    }).then(r => r.body.json());
  }
}