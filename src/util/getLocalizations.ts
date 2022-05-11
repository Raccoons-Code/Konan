import { Locale } from 'discord-api-types/v10';
import { t } from '../translator';

const localeString = Object.values(Locale);

export = function getLocalizations(key: string, options?: { [k: string]: any }): Partial<Record<`${Locale}`, string | null>> {
  return localeString.reduce((acc, locale) => {
    const translation = t(key, { locale, capitalize: null, translation: { noScape: true }, ...options });

    if (translation)
      acc[locale] = translation;

    return acc;
  }, <any>{});
}