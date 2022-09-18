import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { cwd } from 'node:process';

export function normalize(str: string) {
  return str.replace(/\\/g, '/');
}

export class RecursivelyReadDirSync {
  cache: string[] = [];
  found: string[] = [];
  private debug: Console['log'] = () => null;

  constructor(public path: string, public options: FileSystemOptions = {}) {
    if (options.debug) this.debug = console.log;

    this.debug('path: ', path);

    this.path = path = normalize(path).replace(/\/$/, '');

    if (options.absolute)
      this.path = path = cwd() + path.replace(normalize(cwd()), '');

    if (!existsSync(path) || !statSync(path).isDirectory()) {
      if (!this.options.pattern)
        this.options.pattern = options.pattern = [];

      this.options.pattern.push(this.#formatRegExp(path));

      this.path = path = path.replace(/\/?[^/]+$/, '');
    }

    this.#recursivelyReadDirSync(this.path);

    this.found = this.cache;

    if (this.options.ignoreFile) this.#resolveIgnoreFile(this.options.ignoreFile);
    if (this.options.pattern) this.#resolvePattern(this.options.pattern);
    if (this.options.ignore) {
      this.options.ignore = this.#formatRegExp(this.options.ignore);

      this.#resolveIgnore(this.options.ignore);
    }

    this.debug(this);
  }

  #formatRegExp<T extends string>(pattern: T): T
  #formatRegExp<T extends string>(pattern: T[]): T[]
  #formatRegExp<T extends string>(pattern: T | T[]) {
    if (Array.isArray(pattern)) {
      for (let i = 0; i < pattern.length; i++)
        pattern[i] = this.#formatRegExp(pattern[i]);

      return pattern;
    }

    return normalize(pattern)
      .replace(/\/$/, '')
      .replace(/\./g, '\\.')
      .replace(/\*+/g, (str) => str.length > 1 ? '.*' : '[^/]*') +
      '(/.*)?$';
  }

  #resolveIgnore(ignore: string | string[]): void {
    if (Array.isArray(ignore)) {
      for (let i = 0; i < ignore.length; i++)
        this.#resolveIgnore(ignore[i]);

      return;
    }

    this.found = this.found.filter(file => !RegExp(ignore).test(file));
  }

  #resolveIgnoreFile(ignoreFile: string | string[]): void {
    if (Array.isArray(ignoreFile)) {
      for (let i = 0; i < ignoreFile.length; i++)
        this.#resolveIgnoreFile(ignoreFile[i]);

      return;
    }

    if (existsSync(ignoreFile))
      this.options.ignore = [
        ...(this.options.ignore ?? []),
        ...readFileSync(ignoreFile, 'utf8')
          .replace(/#[^\r?\n]+/g, '')
          .split(/\r?\n/)
          .filter(a => a),
      ];
  }

  #resolvePattern(pattern: string | string[]): void {
    if (Array.isArray(pattern)) {
      for (let i = 0; i < pattern.length; i++)
        this.#resolvePattern(pattern[i]);

      return;
    }

    this.found = this.found.filter(file => RegExp(pattern).test(file));
  }

  #recursivelyReadDirSync(path: string) {
    const files = readdirSync(path, { withFileTypes: true });

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.isDirectory()) {
        this.#recursivelyReadDirSync(`${path}/${file.name}`);
      } else {
        this.cache.push(`${path}/${file.name}`);
      }
    }
  }
}

export interface FileSystemOptions {
  absolute?: boolean;
  debug?: boolean;
  ignore?: string[];
  ignoreFile?: string | string[];
  pattern?: string[];
}