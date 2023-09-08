import { Locale } from "discord.js";

export const Locales = Object.fromEntries(Object.entries(Object.assign({}, Locale, { English: "en" }))
  .sort((a, b) => a[0] < b[0] ? -1 : 1).map(([key, value]) => [value, key]));

export function formatLocale(locale: string) {
  return Locales[locale]?.replace(/\W+/g, "").replace(/(?!^[A-Z])[A-Z]+/g, (match) => ` ${match}`) ?? locale;
}
