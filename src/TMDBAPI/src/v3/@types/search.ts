import { Base } from '.';

export interface SearchOptions extends Base {
  include_adult?: boolean
  language?: string
  page?: number
}

export interface SearchMovieProps {
  /**
   * @description Choose whether to inlcude adult (pornography) content in the results.
   * @default false
   */
  include_adult?: boolean
  /**
   * @description Pass a ISO 639-1 value to display translated data for the fields that support it.
   * @minLength 2
   * @maxLength 4
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
   * @description Pass a text query to search. This value should be URI encoded.
   * @minLength 1
   */
  query: string
  /**
   * @description Specify a ISO 3166-1 code to filter release dates. Must be uppercase.
   * @pattern ^[A-Z]{2}$
   */
  region?: string
  year?: number
  primary_release_year?: number
}

export interface SearchMovieData {
  page: number
  results: ResultsMovieData[]
  total_pages: number
  total_results: number
}

export interface ResultsMovieData {
  adult: boolean
  backdrop_path: string | null
  genre_ids: number[]
  id: number
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