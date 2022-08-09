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

  static getAvailableLocales(resources: Resources) {
    return Object.keys(resources).reduce((acc, locale) =>
      ({ ...acc, [locale]: true }),
      <Record<string, boolean>>{});
  }

  static getTranslationsStats(resources: Resources, fallbackLocale: string) {
    const fallbackLocaleLength = Object.keys(resources[fallbackLocale]).length;

    const stats = Object.keys(resources).reduce((acc, locale) =>
      ({ ...acc, [locale]: this.percentage(Object.keys(resources[locale]).length, fallbackLocaleLength) }),
      <Record<string, number>>{});

    return stats;
  }

  static percentage(partialValue: number, totalValue: number) {
    return Number(((100 * partialValue) / totalValue).toFixed(2));
  }
}