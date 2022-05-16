import { Options, PluralData, Resources, TranslationData } from './@types';
import { defaults } from './Defaults';

export default class Translator {
  plural!: PluralData;
  pluralSuffix?: string;
  resources?: Resources;
  singularSuffix?: string;
  translation!: TranslationData;

  constructor(options: Options) {
    Object.assign(this, { ...defaults, ...options });
  }

  translate(key: string, options: Options) {
    const locale = options.locale || 'en';

    const pluralKey = `${key}${options.count === 1 ? this.plural.singularSuffix : this.plural.pluralSuffix}`;

    const noScape = options.translation?.noScape;

    const fallbackLocale = this.resources?.[this.translation.fallbackLocale!]?.translation;

    const { translation } = this.resources?.[locale] ?? this.resources?.[locale.split(/_|-/)[0]] ?? {};

    const text = typeof options.count === 'number' ?
      translation?.[pluralKey] ?? translation?.[key] ?? (noScape ? undefined : fallbackLocale?.[key] ?? key) :
      translation?.[key] ?? (noScape ? undefined : fallbackLocale?.[key] ?? key);

    return text;
  }
}