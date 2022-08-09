import type { Options } from './@types';
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
    this.options = options = { ...defaults, ...options };

    if (options.Locales) {
      const Locales = Object.entries(options.Locales).sort((a, b) => a[0] < b[0] ? -1 : 1)
        .map(([key, value]) => /^[a-z]{2}(-[A-Z]{2})?$/.test(key) ? [key, value] : [value, key]);

      this.options.Locales = Object.fromEntries(Locales);

      this.options.LocalesEnum = Object.fromEntries(Locales.concat(Locales.map(([key, value]) => [value, key])));
    }

    this.options.availableLocales = Util.getAvailableLocales(this.options.resources!, this.options.Locales);

    this.options.stats =
      Util.getTranslationsStats(options.resources!, options.translation!.fallbackLocale!, options.Locales);

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