export interface InterpolationData {
  prefix?: string
  suffix?: string
}

export interface Options {
  [x: string]: any
  capitalize?: boolean | null
  count?: number
  interpolation?: InterpolationData
  locale?: string
  resources?: Resources
  translation?: TranslationData
}

export type Resources = Record<string, Record<string, string>>

export interface TranslationData {
  fallbackLocale?: string
  keySeparator?: string
  noScape?: boolean
}
