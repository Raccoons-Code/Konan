import fetch from 'node-fetch';
import { DiscoverMovieOptions, DiscoverOptions, SearchMoviesData } from '../typings';

export default class Discover {
  apiKey: string;
  baseURL: string;
  include_adult: DiscoverMovieOptions['include_adult'];
  include_video: DiscoverMovieOptions['include_video'];
  language: DiscoverMovieOptions['language'];
  page: DiscoverMovieOptions['page'];
  sort_by: DiscoverMovieOptions['sort_by'];
  with_watch_monetization_types: DiscoverMovieOptions['with_watch_monetization_types'];

  constructor(options: DiscoverOptions) {
    this.apiKey = process.env.TMDB_APIKEY ?? options.apiKey;
    this.baseURL = `${options.baseURL}/discover`;
    this.include_adult = options.include_adult ?? false;
    this.include_video = options.include_video ?? false;
    this.language = options.language || 'en-US';
    this.page = options.page ?? 1;
    this.sort_by = options.sort_by || 'popularity.desc';
    this.with_watch_monetization_types = options.with_watch_monetization_types || 'flatrate';
  }

  async fetchMovies(props: DiscoverMovieOptions = {}): Promise<SearchMoviesData> {
    const { certification_country, certification, certificationgte, certificationlte,
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
      '/movie?api_key=', this.apiKey,
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
}