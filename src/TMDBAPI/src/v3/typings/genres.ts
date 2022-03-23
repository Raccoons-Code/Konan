import { Base } from '.';

export interface GenresOptions extends Base {
  /**
   * @description Pass a ISO 639-1 value to display translated data for the fields that support it.
   * @minLength 2
   * @maxLength 4
   * @pattern ([a-z]{2})-([A-Z]{2})
   * @default 'en-US'
   */
  language?: string
}

export interface Genres {
  genres: Genre[]
}

export interface Genre {
  id: number
  name: string
}

export interface SearchGenresOptions {
  /**
   * @description Pass a ISO 639-1 value to display translated data for the fields that support it.
   * @minLength 2
   * @maxLength 4
   * @pattern ([a-z]{2})-([A-Z]{2})
   * @default 'en-US'
   */
  language?: string
}

export interface GenresData extends Genres {
  language: string
}

export interface ParseGenresOptions {
  genre_ids: number[]
  /**
   * @description Pass a ISO 639-1 value to display translated data for the fields that support it.
   * @minLength 2
   * @maxLength 4
   * @pattern ([a-z]{2})-([A-Z]{2})
   * @default 'en-US'
   */
  language: string
}