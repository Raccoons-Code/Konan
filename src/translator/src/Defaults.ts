import { Options } from '.';

export const defaults = {
  capitalize: undefined,
  interpolation: {
    prefix: '\\{\\{',
    suffix: '\\}\\}',
  },
  plural: {
    pluralSuffix: '_other',
    singularSuffix: '_one',
  },
};

export default class Defaults {
  static get() {
    return defaults;
  }

  static merge(options: any): Options {
    return { ...defaults, ...options };
  }
}