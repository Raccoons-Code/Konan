const fetch = require('node-fetch');

module.exports = class {
  constructor(options) {
    this.apiKey = options.apiKey || process.env.TMDB_APIKEY;
    this.baseURL = `${options.baseURL}/configuration`;

    this.fetchConfiguration();
  }

  /** @private */
  async fetchConfiguration() {
    this.apiConfiguration = await this.fetchApiConfiguration();
    this.countries = await this.fetchCountries();
    this.jobs = await this.fetchJobs();
    this.languages = await this.fetchLanguages();
    this.primaryTranslations = await this.fetchPrimaryTranslations();
    this.timezones = await this.fetchTimezones();
  }

  /**
   * @param {GetLanguageProps} props
   */
  getLanguage(props) {
    const { language: original_language } = props;

    const lang = this.languages?.find(language => language.iso_639_1 === original_language);

    let language = lang?.name || lang?.english_name || lang?.iso_639_1 || original_language;

    language = original_language !== 'en' ? lang?.name ?
      `${language} (${lang?.english_name})` : language : language;

    return language;
  }

  /**
   * @private
   * @returns {Promise<ApiConfiguration>}
   */
  async fetchApiConfiguration() {
    return await fetch(`${this.baseURL}?api_key=${this.apiKey}`).then(r => r.json());
  }

  /**
   * @private
   * @returns {Promise<Countries>}
   */
  async fetchCountries() {
    return await fetch(`${this.baseURL}/countries?api_key=${this.apiKey}`).then(r => r.json());
  }

  /**
   * @private
   * @returns {Promise<Jobs>}
   */
  async fetchJobs() {
    return await fetch(`${this.baseURL}/jobs?api_key=${this.apiKey}`).then(r => r.json());
  }


  /**
   * @private
   * @returns {Promise<Languages>}
   */
  async fetchLanguages() {
    return await fetch(`${this.baseURL}/languages?api_key=${this.apiKey}`).then(r => r.json());
  }

  /**
   * @private
   * @returns {Promise<Countries>}
   */
  async fetchPrimaryTranslations() {
    return await fetch(`${this.baseURL}/primary_translations?api_key=${this.apiKey}`).then(r => r.json());
  }

  /**
   * @private
   * @returns {Promise<Timezones>}
   */
  async fetchTimezones() {
    return await fetch(`${this.baseURL}/timezones?api_key=${this.apiKey}`).then(r => r.json());
  }
};

/**
 * @typedef GetLanguageProps
 * @property {string} language
 */

/**
 * @typedef ApiConfiguration
 * @property {Images} images
 * @property {string[]} change_keys
 * @typedef Images
 * @property {string} base_url
 * @property {string} secure_base_url
 * @property {string[]} backdrop_sizes
 * @property {string[]} logo_sizes
 * @property {string[]} poster_sizes
 * @property {string[]} profile_sizes
 * @property {string[]} still_sizes
 */

/**
 * @typedef Countries
 * @type {Country[]}
 * @typedef Country
 * @property {string} iso_3166_1
 * @property {string} english_name
 */

/**
 * @typedef Jobs
 * @type {Job[]}
 * @typedef Job
 * @property {string} department
 * @property {string[]} jobs
 */

/**
 * @typedef Languages
 * @type {Language[]}
 * @typedef Language
 * @property {string} iso_639_1
 * @property {string} english_name
 * @property {string} name
 */

/**
 * @typedef PrimaryTranslations
 * @type {string[]}
 */

/**
 * @typedef Timezones
 * @type {Timezone[]}
 * @typedef Timezone
 * @property {string} iso_3166_1
 * @property {string[]} zones
 */