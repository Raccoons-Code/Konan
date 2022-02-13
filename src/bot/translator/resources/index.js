const { GlobSync } = require('glob');
const fs = require('fs');

module.exports = new class {
  constructor() {
    const langs = fs.readdirSync(`${__dirname}`).filter(f => fs.statSync(`${__dirname}/${f}`).isDirectory());
    for (let i = 0; i < langs.length; i++) {
      const lang = langs[i];

      const { found } = new GlobSync(`${__dirname}/${lang}/translation*.json`);

      this[lang] = found.reduce((acc, value) => {
        const [, matched] = value.match(RegExp(`(?:${lang}/(.+)\\.json)`));

        const splitted = matched.split('.');

        const key = splitted[splitted.length - 1];

        if (key === 'translation')
          return { translation: require(value) };

        return acc.translation[key] = require(value);
      }, {});
    }
  }
};