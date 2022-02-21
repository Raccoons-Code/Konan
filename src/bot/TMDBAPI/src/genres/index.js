const fetch = require('node-fetch');

module.exports = class {
  constructor(options) {
    this.apiKey = options.apiKey || process.env.TMDB_APIKEY;
    this.baseURL = `${options.baseURL}/genre`;
    this.language = options.language || 'en-US';

    this.cache = new Map();
  }

  /**
   * @param {Props} [props]
   * @returns {Promise<Result>}
   */
  async fetchMovieGenres(props = {}) {
    const { apiKey = this.apiKey, language = this.language } = props;

    if (!this.cache.has(language)) {
      const fetchProps = [
        this.baseURL,
        '/movie/list?api_key=', apiKey,
        '&language=', language,
      ];

      const { genres } = await fetch(fetchProps.join('')).then(r => r.json());

      return this.cache.set(language, { language, genres }).get(language);
    }

    return this.cache.get(language);
  }

  /**
   * @param {Props} [props]
   * @returns {Promise<Result>}
   */
  async fetchTVGenres(props = {}) {
    const { apiKey = this.apiKey, language = this.language } = props;

    return await fetch(`${this.baseURL}/tv/list?api_key=${apiKey}&language=${language}`).then(r => r.json());
  }

  /** @private */
  async fetchGenres() {
    this.movieGenres = await this.fetchMovieGenres();
  }

  /**
   * @param {ParseGenresProps} props
   */
  async parseGenres(props) {
    const { genre_ids, language } = props;

    const { genres } = await this.fetchMovieGenres({ language });

    return genre_ids.map(genre_id => genres.find(genre => genre.id === genre_id).name);
  }
};

/**
 * @typedef ParseGenresProps
 * @property {number[]} genre_ids
 * @property {string} [language='en-US']
 */

/**
 * @typedef Result
 * @property {Genre[]} genres
 * @typedef Genre
 * @property {number} id
 * @property {string} name
 */

/**
 * @typedef Props
 * @property {string} [language=en-US]
 */

/**
 * @typedef Rejected
 * @property {string} status_message
 * @property {number} status_code
 */