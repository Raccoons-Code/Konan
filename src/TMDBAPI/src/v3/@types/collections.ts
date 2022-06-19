export interface GetCollectionDetails {
  collection_id: number
  /**
   * @description Pass a ISO 639-1 value to display translated data for the fields that support it.
   * @minLength 2
   * @pattern ([a-z]{2})-([A-Z]{2})
   * @default 'en-US'
   */
  language?: string
}

export interface APICollectionDetails {
  backdrop_path: string
  id: number
  name: string
  parts: APICollectionPart[]
  poster_path: null
  overview: string
}

export interface APICollectionPart {
  adult: boolean
  backdrop_path: null
  genre_ids: number[]
  id: number
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string
  release_date: string
  title: string
  video: boolean
  vote_average: number
  vote_count: number
}