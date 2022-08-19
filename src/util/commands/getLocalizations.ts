import { Locale } from 'discord.js';
import { t } from '../../translator';

const localeString = Object.values(Locale);

export function getLocalizations(
  key: string,
  options?: Record<string, any>,
): Partial<Record<`${Locale}`, string | null>> {
  return localeString.reduce((acc, locale) => {
    const translation = t(key, { locale, capitalize: null, translation: { noScape: true }, ...options });

    if (!translation) return acc;

    acc[locale] = translation.slice(0, 100);

    /* if (/\w+Name$/.test(key))
      acc[locale] = acc[locale].replace(/\s+|['°]/g, '_').toLowerCase().slice(0, 32); */

    return acc;
  }, <Record<string, string>>{});
}