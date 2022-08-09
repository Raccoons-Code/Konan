export interface InterpolationData {
  prefix?: string
  suffix?: string
}

export interface Options {
  [x: string]: any
  availableLocales?: Record<string, boolean>
  capitalize?: boolean | null
  count?: number
  interpolation?: InterpolationData
  locale?: string
  Locales?: EnumLike<Record<string, string>, string>
  LocalesEnum?: Record<string, string>
  resources?: Resources
  stats?: Record<string, number>
  translation?: TranslationData
}

export type Resources = Record<string, Record<string, string>>

export interface TranslationData {
  fallbackLocale?: string
  keySeparator?: string
  noScape?: boolean
}

type EnumLike<E, V> = Record<keyof E, V>