import { Options, PluralData, Resources } from '.';
import { defaults } from './Defaults';

export default class Translator {
  plural!: PluralData;
  resources?: Resources;
  pluralSuffix?: string;
  singularSuffix?: string;

  constructor(options: Options) {
    Object.assign(this, { ...defaults, ...options });
  }

  translate(key: string, options: Options) {
    const locale = options.locale || 'en';

    const pluralKey = [key, options.count === 1 ? this.plural.singularSuffix : this.plural.pluralSuffix].join('');

    const resources = this.resources?.[locale] ?? this.resources?.[locale.split(/_|-/)[0]];

    const en = this.resources?.en?.translation;

    const translation = resources?.translation;

    const text = typeof options.count === 'number' ?
      translation?.[pluralKey] ?? translation?.[key] ?? en?.[key] ?? key :
      translation?.[key] ?? en?.[key] ?? key;

    return text;
  }
}