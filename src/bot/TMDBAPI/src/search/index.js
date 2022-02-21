const fetch = require('node-fetch');

module.exports = class {
  constructor(options) {
    this.apiKey = options.apiKey || process.env.TMDB_APIKEY;
    this.baseURL = `${options.baseURL}/search`;
    this.include_adult = false;
    this.language = options.language || 'en-US';
    this.page = 1;
  }

  /**
   * @param {SearchMovieProps} props
   * @returns {Promise<Result>}
   */
  async searchMovies(props) {
    const { include_adult = this.include_adult, language = this.language, page = this.page, primary_release_year, query, region, year } = props;

    const searchProps = [
      this.baseURL,
      '/movie?api_key=', this.apiKey,
      '&query=', query,
      '&language=', language,
      '&page=', page,
      '&include_adult=', include_adult,
      primary_release_year ? `&primary_release_year=${primary_release_year}` : '',
      region ? `&region=${region}` : '',
      year ? `&year=${year}` : '',
    ];

    return await fetch(searchProps.join('')).then(r => r.json());
  }
};

/**
 * @typedef SearchMovieProps
 * @property {string} [language='en-US']
 * @property {string} query
 * @property {number} [page=1]
 * @property {boolean} [include_adult=false]
 * @property {string} [region]
 * @property {number} [year]
 * @property {number} [primary_release_year]
 */

/**
 * @typedef Result
 * @property {number} page
 * @property {ResultMovie[]} results
 * @property {number} total_pages
 * @property {number} total_results
 * @typedef ResultMovie
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