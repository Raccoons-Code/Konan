import { defaults } from './Defaults';
import Interpolator, { InterpolationData } from './Interpolator';
import PostProcessor from './PostProcessor';
import Translator from './Translator';

class Idjsn {
  capitalize!: boolean;
  count!: number;
  interpolation!: InterpolationData;
  interpolator!: Interpolator;
  locale!: string;
  plural!: PluralData;
  resources?: Resources;
  translator!: Translator;
  postProcessor!: PostProcessor;

  constructor(options: Options = {}) {
    Object.assign(this, { ...defaults, ...options });
  }

  init(options: Options) {
    Object.assign(idjsn, { ...options });

    idjsn.interpolator = new Interpolator(idjsn);

    idjsn.postProcessor = new PostProcessor(idjsn);

    idjsn.translator = new Translator(idjsn);
  }

  t(key: string | string[], options: Options & { [k: string]: any } = {}) {
    if (Array.isArray(key))
      return idjsn.ta(key, options);

    key = idjsn.translator.translate(key, options);

    key = idjsn.interpolator.interpolate(key, options);

    if (typeof options.capitalize === 'boolean' || typeof idjsn.capitalize === 'boolean')
      key = idjsn.postProcessor.capitalization(key, options);

    return key;
  }

  protected ta(array: string[], options: Options) {
    array = array.map(key => idjsn.t(key, options));

    return array.join(' ').trim();
  }
}

const idjsn = new Idjsn();

export default idjsn;

export const t = idjsn.t;

export interface Options {
  capitalize?: boolean
  count?: number
  interpolation?: InterpolationData
  locale?: string
  plural?: PluralData
  resources?: Resources
}

export interface Resources { [k: string]: { translation: { [k: string]: string } } }

export interface PluralData {
  pluralSuffix?: string
  singularSuffix?: string
}