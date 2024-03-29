import type { Options } from "./@types";
import cache from "./Cache";
import Defaults, { defaults } from "./Defaults";
import Interpolator from "./Interpolator";
import PostProcessor from "./PostProcessor";
import Translator from "./Translator";
import Util from "./Util";

type locale = string;

class Idjsn {
  declare interpolator: Interpolator;
  declare postProcessor: PostProcessor;
  declare translator: Translator;
  options: Options;

  constructor(options?: Options) {
    this.options = Defaults.merge(defaults, options);

    Util.bindFunctions(this);
  }

  init(options: Options) {
    if (!options.resources) throw Error("Missing resources.");
    cache.setResources(options.resources);
    delete options.resources;

    this.options = options = Defaults.merge(defaults, options);

    if (options.Locales) {
      const Locales = Object.entries(options.Locales).sort((a, b) => a[0] < b[0] ? -1 : 1)
        .map(([key, value]) => /^[a-z]{2}(-[A-Z]{2})?$/.test(key) ? [key, value] : [value, key]);

      this.options.Locales = Object.fromEntries(Locales);

      this.options.LocalesEnum = Object.fromEntries(Locales.concat(Locales.map(([key, value]) => [value, key])));
    }

    this.options.availableLocales = Util.getAvailableLocales(cache.resources, options.Locales);

    this.options.stats =
      Util.getTranslationsStats(cache.resources, options.translation!.fallbackLocale!, options.Locales);

    this.interpolator = new Interpolator(options);

    this.postProcessor = new PostProcessor(options);

    this.translator = new Translator(options);
  }

  /**
   * @param key
   * @param options - `Options` OR `locale`
   */
  t(key: string | string[], options: Options | locale = {}): string {
    if (typeof options === "string") {
      options = { locale: options };
    }

    if (Array.isArray(key)) {
      return key.reduce((acc, k) => `${acc} ${this.t(k, options)}`, "");
    }

    key = this.translator.translate(key, options);

    if (typeof key === "string") {
      key = this.interpolator.interpolate(key, options);

      if (
        typeof options.capitalize === "boolean" || typeof this.options.capitalize === "boolean"
      ) {
        if (options.capitalize !== null) {
          key = this.postProcessor.capitalize(key, options);
        }
      }
    }

    return key;
  }
}

const idjsn = new Idjsn();

export default idjsn;
