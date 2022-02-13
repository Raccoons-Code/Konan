/** @type {Options} */
const _this = {};

/** @param {options} options */
function capitalize(string, options) {
  if (options.capitalize || _this.capitalize)
    return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;

  return `${string.charAt(0).toLowerCase()}${string.slice(1)}`;
}

/** @param {Options} object */
function interpolate(text, object) {
  const { locale } = object;
  const prefix = _this.interpolation.prefix;
  const suffix = _this.interpolation.suffix;
  const matched = text.match(RegExp(`${prefix}(.*?)${suffix}`, 'g'));

  if (matched)
    text = text.split(RegExp(`${prefix}.*?${suffix}`, 'g')).reduce((acc, value, index) => {
      const m = matched[index]?.match(RegExp(`${prefix}(.*?)${suffix}`))[1]
        .match(/(?:[^.[\]'\\]+)/g).reduce((pv, cv) => {
          if (Array.isArray(object[cv])) {
            const ca = idjsn.t(`${cv}`, { locale });

            for (let i = 0; i < object[cv].length; i++) {
              const v = object[cv][i];

              object[cv][i] = ca[v] || idjsn.t(`${cv}`)[v] || v;
            }

            return [...pv, ...object[cv]];
          }

          return object[cv] || pv[cv] || cv || [...pv, cv];
        }, []) || [];

      return [...acc, value, m];
    }, []);

  return text.join?.('') || text;
}

class Idjsn {
  /** @param {Options} options */
  constructor(options = {}) {
    if (!options.resources) return;
    if (!options.interpolation) options.interpolation = {};
    if (!options.interpolation.prefix) options.interpolation.prefix = '\\{\\{';
    if (!options.interpolation.suffix) options.interpolation.suffix = '\\}\\}';
    if (!options.plural) options.plural = {};
    if (!options.plural.pluralSuffix) options.plural.pluralSuffix = '_other';
    if (!options.plural.singularSuffix) options.plural.singularSuffix = '_one';

    _this.resources = options.resources;
    _this.capitalize = options.capitalize;
    _this.interpolation = options.interpolation;
    _this.plural = options.plural;
  }

  /** @param {Options} options */
  async init(options) {
    return new Idjsn(options);
  }

  /**
   * @param {string|Array} key
   * @param {Options} options
   */
  t(key, options = {}) {
    if (typeof key === 'object')
      return idjsn.tArray(key, options);

    const locale = options.locale || 'en';

    const pluralSuffix = _this.plural.pluralSuffix;
    const singularSuffix = _this.plural.singularSuffix;
    const pluralKey = options.count === 1 ? `${key}${singularSuffix}` : `${key}${pluralSuffix}`;

    const resources = _this.resources[locale] || _this.resources[locale.split(/_|-/)[0]];

    const en = _this.resources.en?.translation;

    const translation = resources?.translation;

    let text = typeof options.count === 'number' ?
      translation?.[pluralKey] || translation?.[key] || en[key] || key :
      translation?.[key] || en[key] || key;

    if (typeof text === 'string' &&
      (typeof options.capitalize === 'boolean' || typeof _this.capitalize === 'boolean'))
      text = capitalize(text, options);

    if (typeof text === 'string')
      return interpolate(text, options);

    return text;
  }

  /**
   * @param {Array} array
   * @param {Options} options
   * @private
   */
  tArray(array, options) {
    array = array.reduce((acc, key) => [...acc, idjsn.t(key, options)], []);

    return array.join(' ');
  }
}

const idjsn = new Idjsn();

module.exports = idjsn;

/**
 * @typedef Options
 * @property {boolean} [capitalize]
 * @property {number} [count]
 * @property {Interpolation} [interpolation]
 * @property {string} [locale]
 * @property {Plural} [plural]
 * @property {object} [resources]
 */

/**
 * @typedef Interpolation
 * @property {string} prefix
 * @property {string} suffix
 */

/**
 * @typedef Plural
 * @property {string} pluralSuffix
 * @property {string} singularSuffix
 */