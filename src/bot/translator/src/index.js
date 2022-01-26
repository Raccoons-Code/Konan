const _this = {};

function interpolate(text, object) {
  let _text;
  const prefix = _this.interpolation.prefix;
  const suffix = _this.interpolation.suffix;
  const matched = text.match(RegExp(`${prefix}(.*?)${suffix}`, 'g'));

  if (matched)
    text.split(RegExp(`${prefix}.*?${suffix}`, 'g')).forEach((value, index) => {
      let _object;

      matched[index]?.match(RegExp(`${prefix}(.*?)${suffix}`))[1]
        .match(/(?:[^.[\]'\\]+)/g)
        .forEach(key => _object ? (_object = _object[key] || key) : (_object = object[key] || key));

      _text = `${_text || ''}${value || ''}${_object || ''}`;
    });

  return _text || text;
}

module.exports = new class {
  /**
   * @param {object} [options]
   * @param {object} options.resources
   * @param {object} [options.interpolation]
   * @param {string} [options.interpolation.prefix]
   * @param {string} [options.interpolation.suffix]
   */
  init(options) {
    if (!options.resources) return;
    if (!options.interpolation) options.interpolation = {};
    if (!options.interpolation.prefix) options.interpolation.prefix = '\\{\\{';
    if (!options.interpolation.suffix) options.interpolation.suffix = '\\}\\}';

    _this.resources = options.resources;
    _this.interpolation = options.interpolation;
    _this.t = this.t;
  }

  /**
   * @param {String} key
   * @param {Object} [options]
   * @param {String} [options.locale]
   */
  t(key, options) {
    if (!options) options = {};
    const locale = options.locale || 'en';
    const resources = _this.resources[locale] || _this.resources[locale.split(/_|-/)[0]];
    return interpolate(resources?.translation?.[key] || key, options);
  }
};