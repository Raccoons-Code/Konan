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

export interface APIGenres {
  genres: APIGenre[]
}

export interface APIGenre {
  id: number
  name: string
}

export interface GetGenres {
  /**
   * @description Pass a ISO 639-1 value to display translated data for the fields that support it.
   * @minLength 2
   * @maxLength 4
   * @pattern ([a-z]{2})-([A-Z]{2})
   * @default 'en-US'
   */
  language?: string
}

export interface GenresData extends APIGenres {
  /**
   * @description Pass a ISO 639-1 value to display translated data for the fields that support it.
   * @minLength 2
   * @maxLength 4
   * @pattern ([a-z]{2})-([A-Z]{2})
   * @default 'en-US'
   */
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