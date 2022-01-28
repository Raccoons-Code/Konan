/** @type {options} */
const _this = {};

/** @param {options} options */
function capitalize(string, options) {
  if (options.capitalize || _this.capitalize)
    return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;

  return `${string.charAt(0).toLowerCase()}${string.slice(1)}`;
}

/** @param {options} object */
function interpolate(text, object) {
  const _text = [];
  const prefix = _this.interpolation.prefix;
  const suffix = _this.interpolation.suffix;
  const matched = text.match(RegExp(`${prefix}(.*?)${suffix}`, 'g'));

  if (matched)
    text.split(RegExp(`${prefix}.*?${suffix}`, 'g')).forEach((value, index) => {
      let _object;

      matched[index]?.match(RegExp(`${prefix}(.*?)${suffix}`))[1]
        .match(/(?:[^.[\]'\\]+)/g)
        .forEach(key => _object = _object?.[key] || object[key]);

      _text.push(value, _object);
    });

  return _text.join('') || text;
}

class Idjsn {
  /** @param {options} options */
  init(options) {
    if (!options) return;
    if (!options.resources) return;
    if (!options.interpolation) options.interpolation = {};
    if (!options.interpolation.prefix) options.interpolation.prefix = '\\{\\{';
    if (!options.interpolation.suffix) options.interpolation.suffix = '\\}\\}';

    _this.resources = options.resources;
    _this.interpolation = options.interpolation;
    return this;
  }

  /**
   * @param {string} key
   * @param {options} options
   */
  t(key, options) {
    if (!options) options = {};

    _this.interpolation = options.interpolation || _this.interpolation;

    const locale = options.locale || 'en';

    const resources = _this.resources[locale] || _this.resources[locale.split(/_|-/)[0]];

    let text = resources?.translation?.[key] || key;

    if (typeof options.capitalize === 'boolean' || typeof _this.capitalize === 'boolean')
      text = capitalize(text, options);

    return interpolate(text, options);
  }
}

const instance = new Idjsn();

module.exports = instance;

const options = {
  resources: require('../resources'),
  interpolation: {
    prefix: String('\\{\\{'),
    suffix: String('\\}\\}'),
  },
  capitalize: Boolean(),
  locale: String('en'),
};