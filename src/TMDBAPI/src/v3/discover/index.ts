import axios from 'axios';
import { DiscoverOptions, GetDiscoverMovie, APISearchMovies } from '../@types';
import Routes from '../Routes';

export default class Discover {
  apiKey: string;
  baseURL: string;
  include_adult: GetDiscoverMovie['include_adult'];
  include_video: GetDiscoverMovie['include_video'];
  language: GetDiscoverMovie['language'];
  page: GetDiscoverMovie['page'];
  sort_by: GetDiscoverMovie['sort_by'];
  with_watch_monetization_types: GetDiscoverMovie['with_watch_monetization_types'];

  constructor(options: DiscoverOptions) {
    this.apiKey = options.apiKey ?? process.env.TMDB_APIKEY;
    this.baseURL = options.baseURL;
    this.include_adult = options.include_adult ?? false;
    this.include_video = options.include_video ?? false;
    this.language = options.language ?? 'en-US';
    this.page = options.page ?? 1;
    this.sort_by = options.sort_by ?? 'popularity.desc';
    this.with_watch_monetization_types = options.with_watch_monetization_types ?? 'flatrate';
  }

  async fetchMovies(props: GetDiscoverMovie = {}): Promise<APISearchMovies> {
    const {
      certification_country,
      certification,
      certificationgte,
      certificationlte,
      include_adult = this.include_adult,
      include_video = this.include_video,
      language = this.language,
      page = this.page,
      primary_release_year,
      primary_release_dategte,
      primary_release_datelte,
      release_dategte,
      release_datelte,
      sort_by = this.sort_by,
      region,
      vote_averagegte,
      vote_averagelte,
      vote_countgte,
      vote_countlte,
      watch_region,
      with_cast,
      with_companies,
      with_crew,
      with_genres,
      with_keywords,
      with_original_language,
      with_people,
      with_release_type,
      with_runtimegte,
      with_runtimelte,
      with_watch_monetization_types = this.with_watch_monetization_types,
      with_watch_providers,
      without_companies,
      without_genres,
      without_keywords,
      year,
    } = props;

    return axios.get(Routes.discoverMovie(), {
      baseURL: this.baseURL,
      params: {
        api_key: this.apiKey,
        certification_country,
        certification,
        'certification.gte': certificationgte,
        'certification.lte': certificationlte,
        include_adult,
        include_video,
        language,
        page,
        primary_release_year,
        'primary_release_date.gte': primary_release_dategte,
        'primary_release_date.lte': primary_release_datelte,
        'release_date.gte': release_dategte,
        'release_date.lte': release_datelte,
        sort_by,
        region,
        'vote_average.gte': vote_averagegte,
        'vote_average.lte': vote_averagelte,
        'vote_count.gte': vote_countgte,
        'vote_count.lte': vote_countlte,
        watch_region,
        with_cast,
        with_companies,
        with_crew,
        with_genres,
        with_keywords,
        with_original_language,
        with_people,
        with_release_type,
        'with_runtime.gte': with_runtimegte,
        'with_runtime.lte': with_runtimelte,
        with_watch_monetization_types,
        with_watch_providers,
        without_companies,
        without_genres,
        without_keywords,
        year,
      },
    }).then(r => r.data);
  }
}