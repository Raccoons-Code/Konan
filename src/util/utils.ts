import { APIInteractionDataResolvedChannel, APIInteractionDataResolvedGuildMember, APIRole, ApplicationCommandOptionType, Attachment, CachedManager, ChannelManager, codeBlock, CommandInteractionOption, GuildBasedChannel, GuildChannelManager, GuildMember, GuildMemberManager, Locale, Role, RoleManager, User, UserManager } from "discord.js";
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
    const translation = t(key, Object.assign({
      locale,
      capitalize: null,
      translation: {
        noScape: true,
      },
    }, options));

    if (!translation) return acc;

    acc[locale] = translation.slice(0, 100);

    return acc;
  }, <Record<Locale, string>>{});
}

export function getEnumKeys<T extends Record<any, any>>(enumLike: T) {
  return Object.values(enumLike).filter(v => isNaN(v)) as (keyof T)[];
}

export function getOptionFromInteractionOptions<T extends Attachment>(
  options: readonly CommandInteractionOption[],
  type: ApplicationCommandOptionType.Attachment,
): T | string;
export function getOptionFromInteractionOptions<T extends boolean>(
  options: readonly CommandInteractionOption[],
  type: ApplicationCommandOptionType.Boolean,
): T;
export function getOptionFromInteractionOptions<
  T extends APIInteractionDataResolvedChannel | GuildBasedChannel
>(
  options: readonly CommandInteractionOption[],
  type: ApplicationCommandOptionType.Channel,
): T | string;
export function getOptionFromInteractionOptions<
  T extends APIInteractionDataResolvedChannel | GuildBasedChannel
>(
  options: readonly CommandInteractionOption[],
  type: ApplicationCommandOptionType.Channel,
  manager: ChannelManager | GuildChannelManager
): T;
export function getOptionFromInteractionOptions<T extends number>(
  options: readonly CommandInteractionOption[],
  type:
    | ApplicationCommandOptionType.Integer
    | ApplicationCommandOptionType.Number,
): T;
export function getOptionFromInteractionOptions<
  T extends Role | APIRole
>(
  options: readonly CommandInteractionOption[],
  type: ApplicationCommandOptionType.Role,
): T | string;
export function getOptionFromInteractionOptions<
  T extends Role | APIRole
>(
  options: readonly CommandInteractionOption[],
  type: ApplicationCommandOptionType.Role,
  manager: RoleManager
): T;
export function getOptionFromInteractionOptions<T extends string>(
  options: readonly CommandInteractionOption[],
  type: ApplicationCommandOptionType.String,
): T;
export function getOptionFromInteractionOptions<
  T extends GuildMember | APIInteractionDataResolvedGuildMember | User
>(
  options: readonly CommandInteractionOption[],
  type: ApplicationCommandOptionType.User,
): T | string;
export function getOptionFromInteractionOptions<
  T extends GuildMember | APIInteractionDataResolvedGuildMember | User
>(
  options: readonly CommandInteractionOption[],
  type: ApplicationCommandOptionType.User,
  manager: GuildMemberManager | UserManager
): T;
export function getOptionFromInteractionOptions<T>(
  options: readonly CommandInteractionOption[],
  type: ApplicationCommandOptionType,
  manager?: CachedManager<unknown, unknown, unknown>
): T;
export function getOptionFromInteractionOptions(
  options: readonly CommandInteractionOption[],
  type: ApplicationCommandOptionType,
  manager?: CachedManager<unknown, unknown, unknown>,
) {
  let value;

  for (const option of options) {
    if (option.type === type) {
      switch (type) {
        case ApplicationCommandOptionType.Attachment:
          value = option.attachment ?? option.value;
          break;

        case ApplicationCommandOptionType.Channel:
          value = option.channel ?? manager?.resolve(option.value) ?? option.value;
          break;

        case ApplicationCommandOptionType.Mentionable:
          value = option.member ?? option.message ?? option.role ?? option.user ?? option.value;
          break;

        case ApplicationCommandOptionType.Role:
          value = option.role ?? manager?.resolve(option.value) ?? option.value;
          break;

        case ApplicationCommandOptionType.User:
          value = option.member ?? option.user ?? manager?.resolve(option.value) ?? option.value;
          break;

        default:
          value = option.value;
          break;
      }
    } else {
      if (option.options) {
        value = getOptionFromInteractionOptions(option.options, type, manager);
      }
    }
  }

  return value;
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
    if (!iterator) continue;
    bits[iterator] = i;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    i *= (type === "bigint" ? 2n : 2);
  }

  return bits;
}

export function makeMultiTable(
  arrayOfArrays: (string | { toString(): string })[][],
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

export function randomInt<T extends number>(x: T): number;
export function randomInt<T>(length: T[]): number;
export function randomInt<T>(size: Set<T> | Map<string, T>): number;
export function randomInt<T>(xls: number | T[] | Set<T> | Map<string, T>) {
  const num =
    typeof xls === "number" ? xls :
      "length" in xls ? xls.length :
        "size" in xls ? xls.size :
          xls;

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
