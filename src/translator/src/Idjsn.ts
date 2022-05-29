import { InterpolationData, Options, PluralData, Resources } from './@types';
import { defaults } from './Defaults';
import Interpolator from './Interpolator';
import PostProcessor from './PostProcessor';
import Translator from './Translator';
import Util from './Util';

class Idjsn {
  capitalize!: boolean;
  count!: number;
  interpolation!: InterpolationData;
  interpolator!: Interpolator;
  locale!: string;
  plural!: PluralData;
  postProcessor!: PostProcessor;
  resources?: Resources;
  translator!: Translator;

  constructor(options: Options = {}) {
    Object.assign(this, { ...defaults, ...options });

    Util.bindMemberFunctions(this);
  }

  init(options: Options) {
    Object.assign(this, { ...options });

    this.interpolator = new Interpolator(this);

    this.postProcessor = new PostProcessor(this);

    this.translator = new Translator(this);
  }

  t(key: string | string[], options: Options & { [k: string]: any } = {}): string {
    if (Array.isArray(key))
      return this.ta(key, options);

    key = this.translator.translate(key, options)!;

    if (!key) return undefined!;

    if (typeof key === 'string') {
      key = this.interpolator.interpolate(key, options);

      if (options.capitalize !== null &&
        (typeof options.capitalize === 'boolean' || typeof this.capitalize === 'boolean'))
        key = this.postProcessor.capitalization(key, options);
    }

    return key;
  }

  protected ta(array: string[], options: Options) {
    array = <string[]>array.map(key => this.t(key, options));

    return array.join(' ').trim();
  }
}

const idjsn = new Idjsn();

export default idjsn;