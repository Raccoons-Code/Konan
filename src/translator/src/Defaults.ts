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

export default new class Defaults {
  get() {
    return defaults;
  }

  merge(options: any) {
    return { ...defaults, ...options };
  }
};