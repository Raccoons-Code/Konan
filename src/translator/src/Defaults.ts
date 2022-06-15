import { Options } from './@types';

export const defaults: Options = {
  capitalize: undefined,
  interpolation: {
    prefix: '\\{\\{',
    suffix: '\\}\\}',
  },
  plural: {
    pluralSuffix: '_other',
    singularSuffix: '_one',
  },
  translation: {
    fallbackLocale: 'en',
    keySeparator: '.',
    noScape: false,
  },
};

export default class Defaults {
  static get() {
    return defaults;
  }

  static merge(options: Options): Options {
    return { ...defaults, ...options };
  }
}