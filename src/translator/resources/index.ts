import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { RecursivelyReadDirSync } from '../../util/RecursivelyReadDirSync';
import type { Resources } from '../src';

const localesPath = 'public/locales';

const translations: Resources = {};

const langs = readdirSync(`${localesPath}`).filter(f => statSync(`${localesPath}/${f}`).isDirectory());

for (let i = 0; i < langs.length; i++) {
  const lang = langs[i];

  const { found } = new RecursivelyReadDirSync(join(localesPath, lang, '*.json'));

  if (!translations[lang])
    translations[lang] = {};

  for (let j = 0; j < found.length; j++) {
    try {
      const json = JSON.parse(readFileSync(found[j], 'utf8'));

      Object.assign(translations[lang], json);
    } catch (error) {
      console.error(error);
    }
  }
}

export default { ...translations };