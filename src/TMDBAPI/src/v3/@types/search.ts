import { Base } from '.';

export interface SearchOptions extends Base {
  include_adult?: boolean
  language?: string
  page?: number
}

export interface SearchQueryOptions {
  include_adult?: boolean
  language?: string
  page?: number
  query: string
  region?: string
  year?: number
  primary_release_year?: number
}

export interface SearchDetailsOptions {
  append_to_response?: string
  language?: string
  movie_id: number
}

export interface SearchPopularOptions {
  language?: string
  page?: number
  region?: string
}

export interface SearchMoviesData {
  page: number
  results: ResultsMovieData[]
  total_pages: number
  total_results: number
}

export interface ESearchMoviesData extends SearchMoviesData {
  dates: Dates
}

export interface Dates {
  maximum: string
  minimum: string
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