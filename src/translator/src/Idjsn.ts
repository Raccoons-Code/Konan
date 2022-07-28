import { Options } from './@types';
import { defaults } from './Defaults';
import Interpolator from './Interpolator';
import PostProcessor from './PostProcessor';
import Translator from './Translator';
import Util from './Util';

class Idjsn {
  interpolator!: Interpolator;
  postProcessor!: PostProcessor;
  translator!: Translator;
  options: Options;

  constructor(options: Options = defaults) {
    this.options = { ...defaults, ...options };

    Util.bindFunctions(this);
  }

  init(options: Options) {
    this.options = { ...defaults, ...options };

    this.interpolator = new Interpolator(this.options);

    this.postProcessor = new PostProcessor(this.options);

    this.translator = new Translator(this.options);
  }

  t(key: string | string[], options: Options = {}): string {
    if (Array.isArray(key))
      return key.reduce((acc, k) => `${acc} ${this.t(k, options)}`, '');

    key = this.translator.translate(key, options);

    if (typeof key === 'string') {
      key = this.interpolator.interpolate(key, options);

      if (typeof options.capitalize === 'boolean' || typeof this.options.capitalize === 'boolean')
        if (options.capitalize !== null)
          key = this.postProcessor.capitalize(key, options);
    }

    return key;
  }
}

const idjsn = new Idjsn();

export default idjsn;