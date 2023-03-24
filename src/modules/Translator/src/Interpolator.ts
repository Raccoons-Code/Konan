import type { InterpolationOptions, Options } from "./@types";
import Defaults, { defaults } from "./Defaults";

export default class Interpolator {
  declare options: InterpolationOptions;
  pattern: RegExp;
  patterng: RegExp;

  constructor(options: Options) {
    this.options = Defaults.merge(defaults, options).interpolation;

    this.pattern = RegExp(`${this.options.prefix}(.*?)${this.options.suffix}`);

    this.patterng = RegExp(`(${this.options.prefix}.*?${this.options.suffix})`, "g");
  }

  interpolate(key: string, options: Options): string {
    const keys = key.split(this.patterng);

    return keys.reduce<string[]>((previousValue, currentValue) => {
      const matched = currentValue.match(this.pattern);

      if (!matched) return previousValue.concat(currentValue);

      const splitted = matched[1].split(/\W/).filter(a => a);

      for (const value of splitted) {
        currentValue = splitted.at(0) === value ?
          options[value] :
          currentValue?.[<any>value];
      }

      return previousValue.concat(currentValue);
    }, []).join("");
  }
}
