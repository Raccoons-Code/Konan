import idjsn, { Options } from '.';
import { defaults } from './Defaults';

export default class Interpolator {
  prefix?: string;
  suffix?: string;
  pattern: RegExp;
  patterng: RegExp;

  constructor(options: Options) {
    Object.assign(this, { ...defaults.interpolation, ...options.interpolation });

    this.pattern = RegExp([this.prefix, '(.*?)', this.suffix].join(''));

    this.patterng = RegExp([this.prefix, '.*?', this.suffix].join(''), 'g');
  }

  interpolate(key: string, options: Options & { [k: string]: string[] }) {
    const { locale } = options;

    const matched = key.match(this.patterng);

    if (matched)
      key = key.split(this.patterng).reduce((acc: any[], value, index) => {
        return [...acc, value, matched[index]?.match(this.pattern)?.[1]
          ?.match(/(?:[^.[\]'\\]+)/g)?.reduce((pv: any, cv) => {
            if (Array.isArray(options[cv])) {
              const ca = idjsn.t(cv, { locale });

              for (let i = 0; i < options[cv].length; i++) {
                const v = options[cv][i] as any;

                options[cv][i] = ca[v] || idjsn.t(cv)[v] || v;
              }

              return [...pv, ...options[cv]];
            }

            return options[cv] || pv[cv] || cv || [...pv, cv];
          }, [])];
      }, []).join('');

    return key;
  }
}

export interface InterpolationData {
  prefix?: string
  suffix?: string
}