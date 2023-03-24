import { QuickDB } from "quick.db";
import { Routes } from "./Routes";
import Util from "./Util";

const qdb = new QuickDB({ table: "dic" });
const cache = new Map<string, string[]>();

export default class Dictionaries {
  get cache() {
    return cache;
  }

  async fetch(locale: string, wordSize?: WordSizes) {
    const words = await this.#searchOnCache(locale);
    if (words) return Util.limitWordsSize(words, wordSize);

    const route = Routes.get(locale)?.(locale);
    if (!route) return [];

    return fetch(route)
      .then(res => res.text())
      .then(data => cache.set(locale.split(/[_-]/)[0], Util.filterInvalidChars(data.split(/[\r\n]+/g))))
      .then(data => qdb.set<string[]>(locale.split(/[_-]/)[0], data.get(locale.split("-")[0])))
      .then(data => Util.limitWordsSize(data, wordSize))
      .catch(() => []);
  }

  async #searchOnCache(locale: string) {
    if (cache.has(locale)) return cache.get(locale);
    if (cache.has(locale.split(/[_-]/)[0])) return cache.get(locale.split(/[_-]/)[0]);
    if (await qdb.has(locale)) return qdb.get<string[]>(locale);
    if (await qdb.has(locale.split(/[_-]/)[0])) return qdb.get<string[]>(locale.split(/[_-]/)[0]);
  }

  has(locale: string, word: string) {
    return cache.get(locale.split(/[_-]/)[0])?.includes(Util.mapInvalidChars(word));
  }

  async hasAsync(locale: string, word: string) {
    return this.fetch(locale.split(/[_-]/)[0])
      .then(words => words.includes(Util.mapInvalidChars(word)));
  }

  async random(locale: string, wordSize?: number) {
    return this.fetch(locale, wordSize)
      .then(words => words[Math.floor(Math.random() * words.length)]);
  }
}

export const dictionaries = new Dictionaries();

export type WordSizes =
  | number
  | `${min},`
  | `${min},${max}`
  | `,${max}`;

type min = number;
type max = number;
