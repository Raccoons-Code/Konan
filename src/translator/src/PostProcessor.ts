import { Options } from './@types';
import { defaults } from './Defaults';

export default class PostProcessor {
  options: Options;

  constructor(options: Options) {
    this.options = { ...defaults, ...options };
  }

  capitalize(string: string, options: Options) {
    if (options.capitalize || this.options.capitalize)
      return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;

    return `${string.charAt(0).toLowerCase()}${string.slice(1)}`;
  }
}