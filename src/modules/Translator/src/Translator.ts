import type { Options, TranslationOptions } from "./@types";
import cache from "./Cache";
import Defaults, { defaults } from "./Defaults";

export default class Translator {
  declare translation: Required<TranslationOptions>;

  constructor(options: Options) {
    this.translation = <any>Defaults.merge(defaults, options).translation;
  }

  translate(key: string, options: Options) {
    if (options.resources) cache.setResources(options.resources);

    const fallbackLocale = cache.resources?.[this.translation.fallbackLocale];

    const locale = options.locale ?? this.translation.fallbackLocale;

    const pluralRules = new Intl.PluralRules(locale);

    const noScape = options.translation?.noScape ?? this.translation.noScape;

    const translation = cache.resources?.[locale] ?? cache.resources?.[locale.split(/[_-]/)[0]];

    return <string>key.split(options.translation?.keySeparator ?? this.translation.keySeparator)
      .reduce<any>((acc, k) => {
        const pluralKey = `${k}_${pluralRules.select(options.count ?? 1)}`;

        return acc?.[pluralKey] ?? acc?.[k] ??
          (noScape ? null : fallbackLocale?.[pluralKey] ?? fallbackLocale?.[k] ?? k);
      }, translation);
  }
}
