import { readdirSync, statSync } from 'fs';
import { GlobSync } from 'glob';
import { Resources } from '../src';

const translations: Resources = {};

const langs = readdirSync(`${__dirname}`).filter(f => statSync(`${__dirname}/${f}`).isDirectory());

for (let i = 0; i < langs.length; i++) {
  const lang = langs[i];

  const { found } = new GlobSync(`${__dirname}/${lang}/translation*.json`);

  translations[lang] = found.reduce((acc: any, value) => {
    const [, matched] = value.match(RegExp(`(?:(?!${lang})/${lang}/(.+)\\.json)$`)) || [];

    const key = matched.split('.').pop() as string;

    if (!acc.translation && key === 'translation')
      return { translation: require(value) };

    return acc.translation[key] = require(value);
  }, {});
}

export default { ...translations };