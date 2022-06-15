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
    const fallbackLocale = this.resources?.[this.translation.fallbackLocale!];

    const keys = key.split(options.translation?.keySeparator ?? this.translation.keySeparator!);

    const locale = options.locale ?? this.translation.fallbackLocale!;

    const noScape = options.translation?.noScape ?? this.translation.noScape!;

    const translation = this.resources?.[locale!] ?? this.resources?.[locale.split(/_|-/)[0]!];

    key = keys.reduce<any>((acc, k) => {
      const pluralKey = `${k}${options.count === 1 ? this.plural.singularSuffix : this.plural.pluralSuffix}`;

      return typeof options.count === 'number' ?
        acc?.[pluralKey] ?? acc?.[k] ?? (noScape ? undefined : fallbackLocale?.[k] ?? k) :
        acc?.[k] ?? (noScape ? undefined : fallbackLocale?.[k] ?? k);
    }, translation);

    return key;
  }
}