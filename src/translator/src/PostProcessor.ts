import { Options } from './@types';

export default class PostProcessor {
  capitalize?: boolean | null;

  constructor(options: Options) {
    this.capitalize = options.capitalize;
  }

  capitalization(string: string, options: Options) {
    if (options.capitalize ?? this.capitalize)
      return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;

    return `${string.charAt(0).toLowerCase()}${string.slice(1)}`;
  }
}