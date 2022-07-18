import { Options } from './@types';

export const defaults: Options = {
  capitalize: undefined,
  interpolation: {
    prefix: '\\{\\{',
    suffix: '\\}\\}',
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