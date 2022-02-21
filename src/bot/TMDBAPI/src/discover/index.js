const fetch = require('node-fetch');

module.exports = class {
  /**
   * @param {Options} options
   */
  constructor(options) {
    this.apiKey = options.apiKey || process.env.TMDB_APIKEY;
    this.baseURL = `${options.baseURL}/discover`;
    this.include_adult = options.include_adult || false;
    this.include_video = options.include_video || false;
    this.language = options.language || 'en-US';
    this.page = options.page || 1;
    this.sort_by = options.sort_by || 'popularity.desc';
    this.with_watch_monetization_types = options.with_watch_monetization_types || 'flatrate';
  }

  /**
   * @param {MovieProps} props
   * @returns {Result}
   */
  async fetchMovies(props = {}) {
    const { apiKey = this.apiKey,
      certification_country, certification, certificationgte, certificationlte,
      include_adult = this.include_adult,
      include_video = this.include_video,
      language = this.language,
      page = this.page,
      primary_release_year, primary_release_dategte, primary_release_datelte,
      release_dategte, release_datelte,
      sort_by = this.sort_by,
      region,
      vote_averagegte, vote_averagelte,
      vote_countgte, vote_countlte,
      watch_region,
      with_cast,
      with_companies,
      with_crew,
      with_genres,
      with_keywords,
      with_original_language,
      with_people,
      with_release_type,
      with_runtimegte, with_runtimelte,
      with_watch_monetization_types = this.with_watch_monetization_types,
      with_watch_providers,
      without_companies,
      without_genres,
      without_keywords,
      year } = props;

    const fetchProps = [
      this.baseURL,
      '/movie?api_key=', apiKey,
      '&include_adult=', include_adult,
      '&include_video=', include_video,
      '&language=', language,
      '&page=', page,
      '&with_watch_monetization_types', with_watch_monetization_types,
      certification_country ? `&certification_country=${certification_country}` : '',
      certification ? `&certification=${certification}` : '',
      certificationgte ? `&certification.gte=${certificationgte}` : '',
      certificationlte ? `&certification.lte=${certificationlte}` : '',
      primary_release_year ? `&primary_release_year=${primary_release_year}` : '',
      primary_release_dategte ? `&primary_release_date.gte=${primary_release_dategte}` : '',
      primary_release_datelte ? `&primary_release_date.lte=${primary_release_datelte}` : '',
      release_dategte ? `&release_date.gte=${release_dategte}` : '',
      release_datelte ? `&release_date.lte=${release_datelte}` : '',
      sort_by ? `&sort_by=${sort_by}` : '',
      region ? `&region=${region}` : '',
      vote_averagegte ? `&vote_average.gte=${vote_averagegte}` : '',
      vote_averagelte ? `&vote_average.lte=${vote_averagelte}` : '',
      vote_countgte ? `&vote_count.gte=${vote_countgte}` : '',
      vote_countlte ? `&vote_count.lte=${vote_countlte}` : '',
      watch_region ? `&watch_region=${watch_region}` : '',
      with_cast ? `&with_cast=${with_cast}` : '',
      with_companies ? `&with_companies=${with_companies}` : '',
      with_crew ? `&with_crew=${with_crew}` : '',
      with_genres ? `&with_genres=${with_genres}` : '',
      with_keywords ? `&with_keywords=${with_keywords}` : '',
      with_original_language ? `&with_original_language=${with_original_language}` : '',
      with_people ? `&with_people=${with_people}` : '',
      with_release_type ? `&with_release_type=${with_release_type}` : '',
      with_runtimegte ? `&with_runtime.gte=${with_runtimegte}` : '',
      with_runtimelte ? `&with_runtime.lte=${with_runtimelte}` : '',
      with_watch_providers ? `&with_watch_providers=${with_watch_providers}` : '',
      without_companies ? `&without_companies=${without_companies}` : '',
      without_genres ? `&without_genres=${without_genres}` : '',
      without_keywords ? `&without_keywords=${without_keywords}` : '',
      year ? `&year=${year}` : '',
    ];

    return await fetch(fetchProps.join('')).then(r => r.json());
  }
};

/**
 * @typedef Options
 * @property {string} apiKey
 * @property {string} baseURL
 * @property {boolean} include_adult
 * @property {boolean} include_video
 * @property {string} language
 * @property {number} page
 * @property {SortTypes} sort_by
 * @property {MonetizationTypes} with_watch_monetization_types
 */

/**
 * @typedef Result
 * @property {number} page
 * @property {RMovie[]} results
 * @property {number} total_pages
 * @property {number} total_results
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
 * @typedef MovieProps /movie?api_key=
 * @property {string} [certification_country]
 * @property {string} [certification]
 * @property {string} [certificationlte] certification.lte
 * @property {string} [certificationgte] certification.gte
 * @property {boolean} [include_adult=false]
 * @property {boolean} [include_video=false]
 * @property {string} [language='en-US']
 * @property {number} [page=1]
 * @property {number} [primary_release_year]
 * @property {string} [primary_release_dategte] primary_release_date.gte
 * @property {string} [primary_release_datelte] primary_release_date.lte
 * @property {string} [release_dategte] release_date.gte
 * @property {string} [release_datelte] release_date.lte
 * @property {SortTypes} [sort_by='popularity.desc']
 * @property {string} [region]
 * @property {number} [vote_averagegte] vote_average.gte
 * @property {number} [vote_averagelte] vote_average.lte
 * @property {number} [vote_countgte] vote_count.gte
 * @property {number} [vote_countlte] vote_count.lte
 * @property {string} [watch_region]
 * @property {string} [with_cast]
 * @property {string} [with_companies]
 * @property {string} [with_crew]
 * @property {string} [with_genres]
 * @property {string} [with_keywords]
 * @property {string} [with_original_language]
 * @property {string} [with_people]
 * @property {number} [with_release_type]
 * @property {number} [with_runtimegte] with_runtime.gte
 * @property {number} [with_runtimelte] with_runtime.lte
 * @property {MonetizationTypes} [with_watch_monetization_types='flatrate']
 * @property {string} [with_watch_providers]
 * @property {string} [without_companies]
 * @property {string} [without_genres]
 * @property {string} [without_keywords]
 * @property {number} [year]
 * @typedef SortTypes
 * @type {'popularity.desc'|
 * 'popularity.asc'|
 * 'release_date.desc'|
 * 'release_date.asc'|
 * 'revenue.desc'|
 * 'revenue.asc'|
 * 'primary_release_date.desc'|
 * 'primary_release_date.asc'|
 * 'original_title.desc'|
 * 'original_title.asc'|
 * 'vote_average.desc'|
 * 'vote_average.asc'|
 * 'vote_count.desc'|
 * 'vote_count.asc'}
 * @typedef MonetizationTypes
 * @type {'flatrate'|'free'|'ads'|'rent'|'buy'}
 */