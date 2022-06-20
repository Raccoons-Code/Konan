import { GlobSync } from 'glob';
import { readdirSync, statSync } from 'node:fs';
import { posix } from 'node:path';
import { Resources } from '../src';

const translations: Resources = {};

const langs = readdirSync(`${__dirname}`).filter(f => statSync(`${__dirname}/${f}`).isDirectory());

for (let i = 0; i < langs.length; i++) {
  const lang = langs[i];

  const { found } = new GlobSync(posix.resolve('src', 'translator', 'resources', lang, '*.json'));

  translations[lang] = found.reduce((acc, value) => ({ ...acc, ...require(value) }), {});
}

export default { ...translations };