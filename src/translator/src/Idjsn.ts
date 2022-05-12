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
    Object.assign(idjsn, { ...options });

    idjsn.interpolator = new Interpolator(idjsn);

    idjsn.postProcessor = new PostProcessor(idjsn);

    idjsn.translator = new Translator(idjsn);
  }

  t(key: string | string[], options: Options & { [k: string]: any } = {}): string {
    if (Array.isArray(key))
      return idjsn.ta(key, options);

    key = <string>idjsn.translator.translate(key, options);

    if (!key) return <string><unknown>undefined;

    if (typeof key === 'string') {
      key = idjsn.interpolator.interpolate(key, options);

      if (typeof options.capitalize === 'boolean' ||
        (typeof options.capitalize === 'undefined' || typeof idjsn.capitalize === 'boolean'))
        key = idjsn.postProcessor.capitalization(key, options);
    }

    return key;
  }

  protected ta(array: string[], options: Options) {
    array = <string[]>array.map(key => idjsn.t(key, options));

    return array.join(' ').trim();
  }
}

const idjsn = new Idjsn();

export default idjsn;