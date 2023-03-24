import { Resources } from "./@types";

export default class Util {
  static bindFunctions(instance: any) {
    const propertyNames = Object.getOwnPropertyNames(Object.getPrototypeOf(instance));

    for (const propertyName of propertyNames) {
      if (typeof instance[propertyName] === "function")
        instance[propertyName] = instance[propertyName].bind(instance);
    }
  }

  static getAvailableLocales(resources: Resources, locales?: Record<string, string>) {
    return Object.fromEntries(Object.keys(locales ?? resources)
      .map(locale => [locale, resources[locale] ? true : false]));
  }

  static getTranslationsStats(resources: Resources, fallbackLocale: string, locales?: Record<string, string>) {
    const fallbackLocaleLength = Object.keys(resources[fallbackLocale]).length;

    if (locales)
      resources = Object.fromEntries(Object.keys(locales).map(locale => [locale, resources[locale] ?? {}]));

    const stats = Object.fromEntries(Object.entries(resources).map(([locale, translations]) =>
      [locale, this.percentage(Object.keys(translations).length, fallbackLocaleLength)]));

    const statsValues = Object.values(stats);

    stats.Total = Number((statsValues.reduce((acc, val) => acc + val, 0) / statsValues.length).toFixed(2));

    return stats;
  }

  static percentage(partialValue: number, totalValue: number) {
    return Number(((100 * partialValue) / totalValue).toFixed(2));
  }
}
