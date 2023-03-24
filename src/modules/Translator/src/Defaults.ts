import type { Options } from "./@types";

export const defaults = <Required<Options>>{
  interpolation: {
    prefix: "\\{\\{",
    suffix: "\\}\\}",
  },
  translation: {
    fallbackLocale: "en",
    keySeparator: ".",
    noScape: false,
  },
};

export default class Defaults {
  static merge<
    A extends Record<any, any> = Record<any, any>,
    B extends Record<any, any> = Record<any, any>
  >(defaults: A, options?: B): A {
    if (typeof options === "undefined" || options === null) return defaults;

    const keys = Object.keys(defaults);

    for (const key of keys) {
      if (typeof defaults[key] === "object") {
        options[key as keyof B] = this.merge(defaults[key], options[key]);
      } else {
        options[key as keyof B] ??= defaults[key];
      }
    }

    return options;
  }
}
