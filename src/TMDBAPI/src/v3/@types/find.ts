import { Base } from '.';

export interface FindOptions extends Base {
  language?: string
}

/**
 * https://developers.themoviedb.org/3/find/find-by-id
 */
export interface GetFindById {
  external_id: string
  external_source: ExternalSourceTypes
  /**
   * @description Pass a ISO 639-1 value to display translated data for the fields that support it.
   * @minLength 2
   * @pattern ([a-z]{2})-([A-Z]{2})
   * @default 'en-US'
   */
  language?: string
}

export type ExternalSourceTypes =
  | 'imdb_id'
  | 'freebase_mid'
  | 'freebase_id'
  | 'tvdb_id'
  | 'tvrage_id'
  | 'facebook_id'
  | 'twitter_id'
  | 'instagram_id'

/**
 * https://developers.themoviedb.org/3/find/find-by-id
 */
export interface APIFindById {
  movie_results: APIFindByIdMovieResults[]
  person_results: APIFindByIdPersonResults[]
  tv_results: APIFindByIdTVResults[]
  tv_episode_results?: any[]
  tv_season_results?: any[]
}

export interface APIFindByIdMovieResults {
  adult: boolean
  backdrop_path: string | null
  id: number
  genre_ids: number[]
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string | null
  release_date: string
  title: string
  video: boolean
  vote_average: number
  vote_count: number
}

export interface APIFindByIdPersonResults {
  adult: boolean
  id: number
  known_for: KnownForMovie | KnownForTV
  name: string
  popularity: number
  profile_path: string | null
}

export interface APIFindByIdTVResults {
  backdrop_path: string | null
  first_air_date: string
  id: number
  genre_ids: number[]
  name: string
  origin_country: string[]
  original_language: string
  original_name: string
  overview: string
  popularity: number
  poster_path: string | null
  vote_average: number
  vote_count: number
}

export interface KnownForMovie extends APIFindByIdMovieResults {
  media_type: 'movie'
}

export interface KnownForTV extends APIFindByIdTVResults {
  media_type: 'tv'
}