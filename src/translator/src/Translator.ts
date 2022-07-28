import { Options, Resources, TranslationData } from './@types';
import { defaults } from './Defaults';

export default class Translator {
  resources?: Resources;
  translation!: Required<TranslationData>;

  constructor(options: Options) {
    Object.assign(this, { ...defaults, ...options });
  }

  translate(key: string, options: Options) {
    const keys = key.split(options.translation?.keySeparator ?? this.translation.keySeparator);

    const fallbackLocale = this.resources?.[this.translation.fallbackLocale];

    const locale = options.locale ?? this.translation.fallbackLocale;

    const noScape = options.translation?.noScape ?? this.translation.noScape;

    const translation = this.resources?.[locale] ?? this.resources?.[locale.split(/_|-/)[0]];

    key = keys.reduce<any>((acc, k) => {
      const pluralKey = `${k}_${new Intl.PluralRules(locale).select(options.count ?? 0)}`;

      return acc?.[pluralKey] ?? acc?.[k] ?? (noScape ? null : fallbackLocale?.[k] ?? k);
    }, translation);

    return key;
  }
}