import { Base } from '.';

export type ConfigurationOptions = Base

export interface GetLanguageProps {
  language: string
}

export interface ApiConfiguration {
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

export type Countries = Country[]

export interface Country {
  english_name: string
  iso_3166_1: string
}

export type Jobs = Job[]

export interface Job {
  department: string
  jobs: string[]
}

export type Languages = Language[]

export interface Language {
  english_name: string
  iso_639_1: string
  name: string
}

export type PrimaryTranslations = string[]

export type Timezones = Timezone[]

export interface Timezone {
  iso_3166_1: string
  zones: string[]
}