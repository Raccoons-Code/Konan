import { readdirSync, statSync } from 'fs';
import { GlobSync } from 'glob';
import { Resources } from '../src';

const translations: Resources = {};

const langs = readdirSync(`${__dirname}`).filter(f => statSync(`${__dirname}/${f}`).isDirectory());

for (let i = 0; i < langs.length; i++) {
  const lang = langs[i];

  const { found } = new GlobSync(`${__dirname}/${lang}/*.json`);

  translations[lang] = found.reduce((acc: any, value) => {
    if (!acc.translation)
      return { translation: require(value) };

    return Object.assign(acc.translation, require(value));
  }, {});
}

export default { ...translations };