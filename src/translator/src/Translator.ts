import type { Options, TranslationData } from './@types';
import cache from './Cache';
import { defaults } from './Defaults';

export default class Translator {
  translation!: Required<TranslationData>;

  constructor(options: Options) {
    Object.assign(this, { ...defaults, ...options });
  }

  translate(key: string, options: Options) {
    const fallbackLocale = cache.resources?.[this.translation.fallbackLocale];

    const locale = options.locale ?? this.translation.fallbackLocale;

    const noScape = options.translation?.noScape ?? this.translation.noScape;

    const translation = cache.resources?.[locale] ?? cache.resources?.[locale.split(/_|-/)[0]];

    return <string>key.split(options.translation?.keySeparator ?? this.translation.keySeparator)
      .reduce<any>((acc, k) => {
        const pluralKey = `${k}_${new Intl.PluralRules(locale).select(options.count ?? 0)}`;

        return acc?.[pluralKey] ?? acc?.[k] ??
          (noScape ? null : fallbackLocale?.[pluralKey] ?? fallbackLocale?.[k] ?? k);
      }, translation);
  }
}