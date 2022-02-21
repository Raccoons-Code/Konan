const fetch = require('node-fetch');

module.exports = class {
  constructor(options) {
    this.apiKey = options.apiKey || process.env.TMDB_APIKEY;
    this.baseURL = `${options.baseURL}/movie`;
    this.language = options.language || 'en-US';
  }


  /**
   * @param {DetailsProps} [props]
   * @returns {Promise<Movie>}
   */
  async fetchDetails(props) {
    const { append_to_response, apiKey = this.apiKey, movie_id, language = this.language } = props;

    const fetchProps = [
      this.baseURL,
      '/', movie_id,
      '?api_key=', apiKey,
      '&language=', language,
      append_to_response ? `&append_to_response=${append_to_response}` : '',
    ];

    return await fetch(fetchProps.join('')).then(r => r.json());
  }

  /**
   * @param {LatestProps} [props]
   * @returns {Promise<Movie>}
   */
  async fetchLatest(props = {}) {
    const { apiKey = this.apiKey, language = this.language } = props;

    return await fetch(`${this.baseURL}/latest?api_key=${apiKey}&language=${language}`).then(r => r.json());
  }

  /**
   * @param {Props} [props]
   * @returns {Promise<Result>}
   */
  async fetchNowPlaying(props = {}) {
    const { apiKey = this.apiKey, language = this.language, page = 1, region } = props;

    const fetchProps = [
      this.baseURL,
      '/popular?api_key=', apiKey,
      '&language=', language,
      '&page=', page,
      region ? `&region=${region}` : '',
    ];

    return await fetch(fetchProps.join('')).then(r => r.json());
  }

  /**
   * @param {Props} [props]
   * @returns {Promise<Result>}
   */
  async fetchPopular(props = {}) {
    const { apiKey = this.apiKey, language = this.language, page = 1, region } = props;

    const fetchProps = [
      this.baseURL,
      '/popular?api_key=', apiKey,
      '&language=', language,
      '&page=', page,
      region ? `&region=${region}` : '',
    ];

    return await fetch(fetchProps.join('')).then(r => r.json());
  }
};

/**
 * @typedef LatestProps
 * @property {string} [language='en-US']
 */

/**
 * @typedef Movie
 * @property {boolean} adult
 * @property {string|null} backdrop_path
 * @property {null} belongs_to_collection
 * @property {number} budget
 * @property {Genre[]} genres
 * @property {string} homepage
 * @property {number} id
 * @property {string} imdb_id
 * @property {string} original_language
 * @property {string} original_title
 * @property {string} overview
 * @property {number} popularity
 * @property {string|null} poster_path
 * @property {ProductionCompanies[]} production_companies
 * @property {ProductionCountries[]} production_countries
 * @property {string} release_date
 * @property {number} revenue
 * @property {number} runtime
 * @property {SpokenLanguages[]} spoken_languages
 * @property {string} status
 * @property {string} tagline
 * @property {string} title
 * @property {boolean} video
 * @property {number} vote_average
 * @property {number} vote_count
 * @typedef Genre
 * @property {number} id
 * @property {string} name
 * @typedef ProductionCompanies
 * @property {string} name
 * @property {number} id
 * @property {string|null} logo_path
 * @property {string} origin_country
 * @typedef ProductionCountries
 * @property {string} iso_3166_1
 * @property {string} name
 * @typedef SpokenLanguages
 * @property {string} iso_639_1
 * @property {string} name
 */

/**
 * @typedef Result
 * @property {number} page
 * @property {RMovie[]} results
 * @property {Dates} dates
 * @property {number} total_pages
 * @property {number} total_results
 * @typedef Dates
 * @property {string} maximum
 * @property {string} minimum
 * @typedef RMovie
 * @property {boolean} adult
 * @property {string|null} backdrop_path
 * @property {number[]} genre_ids
 * @property {number} id
 * @property {string} original_language
 * @property {string} original_title
 * @property {string} overview
 * @property {number} popularity
 * @property {string|null} poster_path
 * @property {string} release_date
 * @property {string} title
 * @property {boolean} video
 * @property {number} vote_average
 * @property {number} vote_count
 */

/**
 * @typedef DetailsProps
 * @property {string} [append_to_response]
 * @property {string} [language='en-US']
 * @property {number} movie_id
 */

/**
 * @typedef Props
 * @property {string} [language='en-US']
 * @property {number} [page=1]
 * @property {string} [region]
 */