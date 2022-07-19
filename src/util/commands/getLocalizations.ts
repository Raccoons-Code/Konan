import { Locale } from 'discord.js';
import { t } from '../../translator';

const localeString = Object.values(Locale);

export function getLocalizations(
  key: string,
  options?: { [k: string]: any },
): Partial<Record<`${Locale}`, string | null>> {
  return localeString.reduce((acc, locale) => {
    const translation = t(key, { locale, capitalize: null, translation: { noScape: true }, ...options });

    if (translation) {
      acc[locale] = translation.slice(0, 100);

      if (/\w+Name$/i.test(key)) {
        acc[locale] = acc[locale].replace(/\s+|['°]/g, '_').toLowerCase().slice(0, 32);
      }
    }

    return acc;
  }, <{ [k: string]: string }>{});
}