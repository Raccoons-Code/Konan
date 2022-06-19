import { Base } from '.';

export type ConfigurationOptions = Base

export interface GetLanguageProps {
  language: string
}

/**
 * https://developers.themoviedb.org/3/configuration/get-api-configuration
 */
export interface APIConfiguration {
  change_keys: string[]
  images: {
    backdrop_sizes: string[]
    base_url: string
    logo_sizes: string[]
    poster_sizes: string[]
    profile_sizes: string[]
    secure_base_url: string
    still_sizes: string[]
  }
}

/**
 * https://developers.themoviedb.org/3/configuration/get-countries
 */
export type APICountries = Country[]

export interface Country {
  english_name: string
  iso_3166_1: string
}

/**
 * https://developers.themoviedb.org/3/configuration/get-jobs
 */
export type APIJobs = Job[]

export interface Job {
  department: string
  jobs: string[]
}

/**
 * https://developers.themoviedb.org/3/configuration/get-languages
 */
export type APILanguages = Language[]

export interface Language {
  english_name: string
  iso_639_1: string
  name: string
}

/**
 * https://developers.themoviedb.org/3/configuration/get-primary-translations
 */
export type APIPrimaryTranslations = string[]

/**
 * https://developers.themoviedb.org/3/configuration/get-timezones
 */
export type APITimezones = Timezone[]

export interface Timezone {
  iso_3166_1: string
  zones: string[]
}