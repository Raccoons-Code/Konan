import { Options } from './@types';
import { defaults } from './Defaults';
import idjsn from './Idjsn';

export default class Interpolator {
  pattern: RegExp;
  patterng: RegExp;
  prefix!: string;
  suffix!: string;

  constructor(options: Options) {
    Object.assign(this, { ...defaults.interpolation, ...options.interpolation });

    this.pattern = RegExp(`${this.prefix}(.*?)${this.suffix}`);

    this.patterng = RegExp(`${this.prefix}.*?${this.suffix}`, 'g');
  }

  interpolate(key: string, options: Options & { [k: string]: string[] }) {
    const locale = options.locale;

    const matched = key.match(this.patterng);

    if (!matched) return key;

    return key.split(this.patterng).reduce((acc: any[], value, index) => {
      return acc.concat(value, matched[index]?.match(this.pattern)?.[1]
        ?.match(/(?:[^.[\]'\\]+)/g)?.reduce((pv: any, cv) => {
          if (Array.isArray(options[cv])) {
            const ca = idjsn.t(cv, { locale });

            for (let i = 0; i < options[cv].length; i++) {
              const v = <any>options[cv][i];

              options[cv][i] = ca[v] ?? idjsn.t(cv)[v] ?? v;
            }

            return pv.concat(options[cv]);
          }

          return options[cv] ?? pv[cv] ?? cv ?? pv.concat(cv);
        }, []));
    }, []).join('');
  }
}