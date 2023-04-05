import { codeBlock, Locale } from "discord.js";
import { t } from "../translator";
import { CONTENT_LENGTH, LOCALES } from "./constants";
import regexp from "./regexp";

export function codeBlockLength(language?: string) {
  return language ?
    codeBlock(language, "").length :
    codeBlock("").length;
}

export function contentWithCodeBlockLength(language?: string) {
  return CONTENT_LENGTH - codeBlockLength(language);
}

export function isClass(value: any) {
  return typeof value === "function" && regexp.isClass.test(value.toString());
}

export function getLocalizations(
  key: string,
  options?: Record<string, any>,
): Partial<Record<Locale, string | null>> {
  return LOCALES.reduce((acc, locale) => {
    const translation = t(key, {
      locale,
      capitalize: null,
      translation: { noScape: true },
      ...options,
    });

    if (!translation) return acc;

    acc[locale] = translation.slice(0, 100);

    return acc;
  }, <Record<Locale, string>>{});
}

export function JSONparse<T = Record<any, any>>(string: string): T | null {
  try {
    return JSON.parse(string);
  } catch {
    return null;
  }
}

export function makeBits<T extends string | number | symbol>(array: Readonly<T[]>): Record<T, bigint | number>;
export function makeBits<T extends string | number | symbol>(array: Readonly<T[]>, type: "number"): Record<T, number>;
export function makeBits<T extends string | number | symbol>(array: Readonly<T[]>, type: "bigint"): Record<T, bigint>;
export function makeBits<T extends string | number | symbol>(array: Readonly<T[]>, type?: "bigint" | "number") {
  let i = type === "bigint" ? 1n : 1;

  if (array.length > 55) {
    type = "bigint";
    i = 1n;
  }

  const bits = <Record<T, typeof i>>{};

  for (const iterator of array) {
    bits[iterator] = i;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    i *= (type === "bigint" ? 2n : 2);
  }

  return bits;
}

export function makeMultiTable(
  arrayOfArrays: (number | string)[][],
  sep = " | ",
) {
  const greaterValues: string[] = [];

  for (const array of arrayOfArrays) {
    for (let j = 0; j < array.length; j++) {
      const value = `${array[j] ?? ""}`;

      if (!greaterValues[j]) {
        greaterValues[j] = value;

        continue;
      }

      if (value.length > greaterValues[j].length) {
        greaterValues[j] = value;

        continue;
      }

      continue;
    }

    continue;
  }

  return arrayOfArrays.map(array => array.map((value, j) =>
    `${value ?? ""}`.padEnd(greaterValues[j].length))
    .join(sep)).join("\n");
}

export function makeTable<T extends [any, any]>(array: T[], sep = " : ") {
  const greaterLength = array.reduce((acc, arr) => acc.length > arr[0].length ? acc : arr[0], "").length;
  return array.reduce((acc, arr) => `${acc}${arr[0].padEnd(greaterLength)}${sep}${arr[1]}\n`, "");
}

export function mathRandom<T>(length: number | T[] | Set<T> | Map<string, T>) {
  const num =
    typeof length === "number" ? length :
      "length" in length ? length.length :
        "size" in length ? length.size :
          length;

  return Math.floor(Math.random() * (isNaN(num) ? 0 : num));
}

export function mergeDefaults<
  A extends Record<any, any>,
  B extends Record<any, any>
>(defaults: A, options?: B) {
  if (typeof options === "undefined" || options === null) return defaults;

  const keys = Object.keys(defaults);

  for (const key of keys) {
    if (typeof defaults[key] === "object") {
      options[key as keyof B] = mergeDefaults(defaults[key], options[key]);
    } else {
      options[key as keyof B] ??= defaults[key];
    }
  }

  return options;
}

export function splitArrayInGroups<T = any>(
  array: T[],
  length = 10,
  groups?: T[][],
) {
  if (!groups) groups = [];
  if (!array?.length) return groups;
  if (isNaN(length) || length < 1) return groups;

  while (array.length) {
    groups.push(array.splice(0, length));
  }

  return groups;
}
