import { Resources } from './@types';

export default class Util {
  static bindFunctions(instance: any) {
    const propertyNames = Object.getOwnPropertyNames(Object.getPrototypeOf(instance));

    for (let i = 0; i < propertyNames.length; i++) {
      const propertyName = propertyNames[i];

      if (typeof instance[propertyName] === 'function')
        instance[propertyName] = instance[propertyName].bind(instance);
    }
  }

  static getAvailableLocales(resources: Resources, locales?: Record<string, string>) {
    return Object.keys(locales ?? resources).reduce((acc, locale) =>
      ({ ...acc, [locale]: resources[locale] ? true : false }),
      <Record<string, boolean>>{});
  }

  static getTranslationsStats(resources: Resources, fallbackLocale: string, locales?: Record<string, string>) {
    const fallbackLocaleLength = Object.keys(resources[fallbackLocale]).length;

    if (locales)
      resources = { ...Object.fromEntries(Object.keys(locales).map(locale => [locale, resources[locale] ?? {}])) };

    const stats = Object.keys(resources).reduce((acc, locale) =>
      ({ ...acc, [locale]: this.percentage(Object.keys(resources[locale]).length, fallbackLocaleLength) }),
      <Record<string, number>>{});

    return stats;
  }

  static percentage(partialValue: number, totalValue: number) {
    return Number(((100 * partialValue) / totalValue).toFixed(2));
  }
}