import type { Options } from "./@types";
import Defaults, { defaults } from "./Defaults";

export default class PostProcessor {
  options: Options;

  constructor(options: Options) {
    this.options = Defaults.merge(defaults, options);
  }

  capitalize(string: string, options: Options) {
    if (options.capitalize || this.options.capitalize)
      return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;

    return `${string.charAt(0).toLowerCase()}${string.slice(1)}`;
  }
}
