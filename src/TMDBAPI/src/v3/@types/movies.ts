import { Base, Genre, SearchMoviesData } from '.';

export interface MoviesDetailsProps {
  append_to_response?: string
  language?: string
  movie_id: number
}

export interface MoviesPopularProps {
  language?: string
  page?: number
  region?: string
}

export interface MoviesPopularData extends SearchMoviesData {
  dates: Dates
}

export interface Dates {
  maximum: string
  minimum: string
}

export interface MoviesOptions extends Base {
  language?: string
}

export interface Movie {
  adult: boolean
  backdrop_path: string | null
  belongs_to_collection: object | null
  budget: number
  genres: Genre[]
  homepage: string
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