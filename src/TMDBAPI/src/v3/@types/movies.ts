import { APIGenre, APISearchMovies, Base } from '.';

/**
 * https://developers.themoviedb.org/3/movies/get-latest-movie
 */
export interface GetLatest {
  /**
   * @description Pass a ISO 639-1 value to display translated data for the fields that support it.
   * @minLength 2
   * @pattern ([a-z]{2})-([A-Z]{2})
   * @default: en-US
   */
  language?: string;
}

/**
 * https://developers.themoviedb.org/3/movies/get-movie-details
 */
export interface GetMovieDetails {
  /**
* @description Append requests within the same namespace to the response.
* @pattern ([\w]+)
*/
  append_to_response?: string
  /**
   * @description Pass a ISO 639-1 value to display translated data for the fields that support it.
   * @minLength 2
   * @pattern ([a-z]{2})-([A-Z]{2})
   * @default 'en-US'
   */
  language?: string
  movie_id: number
}

/**
 * https://developers.themoviedb.org/3/movies/get-now-playing
 */
export interface GetNowPlaying {
  /**
* @description Pass a ISO 639-1 value to display translated data for the fields that support it.
* @minLength 2
* @pattern ([a-z]{2})-([A-Z]{2})
* @default 'en-US'
*/
  language?: string
  /**
   * @description Specify which page to query.
   * @minimum 1
   * @maximum 1000
   * @default 1
   */
  page?: number
  /**
   * @description Specify a ISO 3166-1 code to filter release dates. Must be uppercase.
   * @pattern ^[A-Z]{2}$
   */
  region?: string
}

export interface APINowPlaying extends APISearchMovies {
  dates: Dates
}

export interface Dates {
  /**
   * @format date
   */
  maximum: string
  /**
   * @format date
   */
  minimum: string
}

export interface MoviesOptions extends Base {
  /**
   * @description Pass a ISO 639-1 value to display translated data for the fields that support it.
   * @minLength 2
   * @pattern ([a-z]{2})-([A-Z]{2})
   * @default 'en-US'
   */
  language?: string
}

export interface APIMovieDetails {
  adult: boolean
  backdrop_path: string | null
  belongs_to_collection: any[] | null
  budget: number
  genres: APIGenre[]
  homepage: string | null
  id: number
  /**
   * @minLength 9
   * @maxLength 9
   * @pattern ^tt[0-9]{7}
   */
  imdb_id: string
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string | null
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  /** @format date */
  release_date: string
  revenue: number
  runtime: number
  spoken_languages: SpokenLanguage[]
  status: StatusTypes
  tagline: string
  title: string
  video: boolean
  vote_average: number
  vote_count: number
}

export interface ProductionCompany {
  id: number
  logo_path: string | null
  name: string
  origin_country: string
}

export interface ProductionCountry {
  iso_3166_1: string
  name: string
}

export interface SpokenLanguage {
  iso_639_1: string
  name: string
}

export type StatusTypes = 'Canceled' | 'In Production' | 'Planned' | 'Post Production' | 'Released' | 'Rumored'