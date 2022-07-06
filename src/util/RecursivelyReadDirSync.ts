import { PathLike, readdirSync } from 'node:fs';

export default class RecursivelyReadDirSync {
  cache: string[] = [];
  found: string[] = [];

  constructor(public path: PathLike, public options: FileSystemOptions) {
    this.#recursivelyReadDirSync(path);

    this.found = this.cache;

    if (options.pattern) this.#resolvePattern(options.pattern);
    if (options.ignore) this.#resolveIgnore(options.ignore);
  }

  #resolveIgnore(ignore: RegExp | string): void {
    if (typeof ignore === 'string')
      return this.#resolveIgnore(RegExp(ignore, 'i'));

    this.found = this.found.filter(file => !ignore.test(file));
  }

  #resolvePattern(pattern: RegExp | string): void {
    if (typeof pattern === 'string')
      return this.#resolvePattern(RegExp(pattern, 'i'));

    this.found = this.found.filter(file => pattern.test(file));
  }

  #recursivelyReadDirSync(path: PathLike) {
    const dirent = readdirSync(path, { withFileTypes: true });

    for (let i = 0; i < dirent.length; i++) {
      const element = dirent[i];

      if (element.isDirectory()) {
        this.#recursivelyReadDirSync(`${path}/${element.name}`);
      } else {
        this.cache.push(`${path}/${element.name}`);
      }
    }
  }
}

console.log(new RecursivelyReadDirSync('./src/TMDBAPI', { pattern: /\.ts$/ }));

export interface FileSystemOptions {
  ignore?: RegExp | string;
  pattern?: RegExp | string;
}