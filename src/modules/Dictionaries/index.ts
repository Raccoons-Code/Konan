import axios from 'axios';
import { QuickDB } from 'quick.db';
import { Routes } from './Routes';
import Util from './Util';

const quickDb = new QuickDB({ table: 'dic' });
const cache: Record<string, string[]> = {};

export default class Dictionaries {
  get cache() {
    return cache;
  }

  async fetch(locale: string, wordSize?: WordSizes) {
    const words = await this.#searchOnCache(locale);
    if (words) return Util.limitWordsSize(words, wordSize);

    const route = Routes.get(locale)?.(locale);
    if (!route) return [];

    return axios.get(route)
      .then(({ data }) => quickDb.set<string[]>(locale.split('-')[0],
        this.cache[locale.split('-')[0]] = Util.filterInvalidChars(data.split(/\r?\n/g))))
      .then(data => Util.limitWordsSize(data, wordSize))
      .catch(() => []);
  }

  async #searchOnCache(locale: string) {
    if (this.cache[locale]) return this.cache[locale];
    if (this.cache[locale.split('-')[0]]) return this.cache[locale.split('-')[0]];
    if (await quickDb.has(locale)) return await quickDb.get(locale) as string[];
    if (await quickDb.has(locale.split('-')[0])) return await quickDb.get(locale.split('-')[0]) as string[];
  }

  has(locale: string, word: string) {
    return this.cache[locale.split('-')[0]]?.includes(Util.mapInvalidChars(word));
  }

  async hasAsync(locale: string, word: string) {
    return this.fetch(locale.split('-')[0]).then(words => words.includes(Util.mapInvalidChars(word)));
  }

  async random(locale: string, wordSize?: number) {
    return this.fetch(locale, wordSize).then(words => words[Math.floor(Math.random() * words.length)]);
  }
}

export const dictionaries = new Dictionaries();

export type WordSizes =
  | number
  | `${min},`
  | `${min},${max}`
  | `,${max}`

type min = number
type max = number