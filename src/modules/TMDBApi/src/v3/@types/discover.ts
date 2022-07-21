import { Base } from '.';

export interface DiscoverOptions extends Base {
  /**
   * @description A filter and include or exclude adult movies.
   * @default false
   */
  include_adult?: GetDiscoverMovie['include_adult']
  /**
   * @description A filter to include or exclude videos.
   * @default false
   */
  include_video?: GetDiscoverMovie['include_video']
  /**
   * @description Specify a language to query translatable fields with.
   * @minLength 2
   * @maxLength 4
   * @pattern ([a-z]{2})-([A-Z]{2})
   * @default 'en-US'
   */
  language?: GetDiscoverMovie['language']
  /**
   * primary_release_date.gte
   * @description Filter and only include movies that have a primary release date that is greater or equal to the specified value.
   * @format date
   */
  page?: GetDiscoverMovie['page']
  /**
   * @description Choose from one of the many available sort options.
   * @default 'popularity.desc'
   */
  sort_by?: GetDiscoverMovie['sort_by']
  /**
   * @description In combination with watch_region, you can filter by monetization type.
   * @default 'flatrate'
   */
  with_watch_monetization_types?: GetDiscoverMovie['with_watch_monetization_types']
}

/**
 * https://developers.themoviedb.org/3/discover/movie-discover
 */
export interface GetDiscoverMovie {
  /**
   * @description Used in conjunction with the certification filter, use this to specify a country with a valid certification.
   */
  certification_country?: string
  /**
   * @description Filter results with a valid certification from the 'certification_country' field.
   */
  certification?: string
  /**
   * certification.gte
   * @description Filter and only include movies that have a certification that is greater than or equal to the specified value.
   */
  certificationgte?: string
  /**
   * certification.lte
   * @description Filter and only include movies that have a certification that is less than or equal to the specified value.
   */
  certificationlte?: string
  /**
   * @description A filter and include or exclude adult movies.
   * @default false
   */
  include_adult?: boolean
  /**
   * @description A filter to include or exclude videos.
   * @default false
   */
  include_video?: boolean
  /**
   * @description Specify a language to query translatable fields with.
   * @minLength 2
   * @maxLength 4
   * @pattern ([a-z]{2})-([A-Z]{2})
   * @default 'en-US'
   */
  language?: string
  /**
   * @description Specify the page of results to query.
   * @minimum 1
   * @maximum 1000
   * @default 1
   */
  page?: number
  /**
   * primary_release_date.gte
   * @description Filter and only include movies that have a primary release date that is greater or equal to the specified value.
   * @format date
   */
  primary_release_dategte?: string
  /**
   * primary_release_date.lte
   * @description Filter and only include movies that have a primary release date that is less than or equal to the specified value.
   * @format date
   */
  primary_release_datelte?: string
  /**
   * @description A filter to limit the results to a specific primary release year.
   */
  primary_release_year?: number
  /**
   * release_date.gte
   * @description Filter and only include movies that have a release date (looking at all release dates) that is greater or equal to the specified value.
   * @format date
   */
  release_dategte?: string
  /**
   * release_date.lte
   * @description Filter and only include movies that have a release date (looking at all release dates) that is less than or equal to the specified value.
   * @format date
   */
  release_datelte?: string
  /**
   * @description Choose from one of the many available sort options.
   * @default 'popularity.desc'
   */
  sort_by?: SortTypes
  /**
   * @description Specify a ISO 3166-1 code to filter release dates. Must be uppercase.
   * @pattern ^[A-Z]{2}$
   */
  region?: string
  /**
   * vote_average.gte
   * @description Filter and only include movies that have a rating that is greater or equal to the specified value.
   * @minimum 0
   */
  vote_averagegte?: number
  /**
   * vote_average.lte
   * @description Filter and only include movies that have a rating that is less than or equal to the specified value.
   * @minimum 0
   */
  vote_averagelte?: number
  /**
   * vote_count.gte
   * @description Filter and only include movies that have a vote count that is greater or equal to the specified value.
   * @minimum 0
   */
  vote_countgte?: number
  /**
   * vote_count.lte
   * @description Filter and only include movies that have a vote count that is less than or equal to the specified value.
   * @minimum 1
   */
  vote_countlte?: number
  /**
   * @description An ISO 3166-1 code. Combine this filter with with_watch_providers in order to filter your results by a specific watch provider in a specific region.
   */
  watch_region?: string
  /**
   * @description A comma separated list of person ID's. Only include movies that have one of the ID's added as an actor.
   */
  with_cast?: string
  /**
   * @description A comma separated list of production company ID's. Only include movies that have one of the ID's added as a production company.
   */
  with_companies?: string
  /**
   * @description A comma separated list of person ID's. Only include movies that have one of the ID's added as a crew member.
   */
  with_crew?: string
  /**
   * @description Comma separated value of genre ids that you want to include in the results.
   */
  with_genres?: string
  /**
   * @description A comma separated list of keyword ID's. Only includes movies that have one of the ID's added as a keyword.
   */
  with_keywords?: string
  /**
   * @description Specify an ISO 639-1 string to filter results by their original language value.
   */
  with_original_language?: string
  /**
   * @description A comma separated list of person ID's. Only include movies that have one of the ID's added as a either a actor or a crew member.
   */
  with_people?: string
  /**
   * @description Specify a comma (AND) or pipe (OR) separated value to filter release types by. These release types map to the same values found on the movie release date method.
   * @minimum 1
   * @maximum 6
   */
  with_release_type?: number
  /**
   * with_runtime.gte
   * @description Filter and only include movies that have a runtime that is greater or equal to a value.
   */
  with_runtimegte?: number
  /**
   * with_runtime.lte
   * @description Filter and only include movies that have a runtime that is less than or equal to a value.
   */
  with_runtimelte?: number
  /**
   * @description In combination with watch_region, you can filter by monetization type.
   * @default 'flatrate'
   */
  with_watch_monetization_types?: MonetizationTypes
  /**
   * @description
   */
  with_watch_providers?: string
  /**
   * @description Filter the results to exclude the specific production companies you specify here. AND / OR filters are supported.
   */
  without_companies?: string
  /**
   * @description Comma separated value of genre ids that you want to exclude from the results.
   */
  without_genres?: string
  /**
   * @description Exclude items with certain keywords. You can comma and pipe seperate these values to create an 'AND' or 'OR' logic.
   */
  without_keywords?: string
  /**
   * @description A filter to limit the results to a specific year (looking at all release dates).
   */
  year?: number
}

/**
 * @description In combination with watch_region, you can filter by monetization type.
 * @default 'flatrate'
 */
export type MonetizationTypes = 'ads' | 'buy' | 'flatrate' | 'free' | 'rent'

/**
 * @description Choose from one of the many available sort options.
 * @default 'popularity.desc'
 */
export type SortTypes =
  | 'original_title.asc'
  | 'original_title.desc'
  | 'popularity.asc'
  | 'popularity.desc'
  | 'primary_release_date.asc'
  | 'primary_release_date.desc'
  | 'release_date.asc'
  | 'release_date.desc'
  | 'revenue.asc'
  | 'revenue.desc'
  | 'vote_average.asc'
  | 'vote_average.desc'
  | 'vote_count.asc'
  | 'vote_count.desc'