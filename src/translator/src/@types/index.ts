export interface InterpolationData {
  prefix?: string
  suffix?: string
}

export interface Options {
  [k: string]: any
  capitalize?: boolean | null
  count?: number
  interpolation?: InterpolationData
  locale?: string
  plural?: PluralData
  resources?: Resources
  translation?: TranslationData
}

export interface PluralData {
  pluralSuffix?: string
  singularSuffix?: string
}

export interface Resources { [k: string]: { [k: string]: string } }

export interface TranslationData {
  fallbackLocale?: string
  keySeparator?: string
  noScape?: boolean
}
