const { GlobSync } = require('glob');
const fs = require('fs');

module.exports = new class {
  constructor() {
    const langs = fs.readdirSync(`${__dirname}`).filter(f => fs.statSync(`${__dirname}/${f}`).isDirectory());
    for (let i = 0; i < langs.length; i++) {
      const lang = langs[i];

      const { found } = new GlobSync(`${__dirname}/${lang}/translation*.json`);

      this[lang] = found.reduce((acc, value) => {
        const [, matched] = value.match(RegExp(`(?:(?!${lang})/${lang}/(.+)\\.json)$`));

        const key = matched.split('.').pop();

        if (!acc.translation && key === 'translation')
          return { translation: require(value) };

        return acc.translation[key] = require(value);
      }, {});
    }
  }
};