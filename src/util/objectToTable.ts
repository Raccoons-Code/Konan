export = <T = Record<string, string>>(obj: T, separator = ':') => {
  const keys = Object.keys(obj);
  const greaterLength = keys.reduce((acc, key) => acc.length > key.length ? acc : key, '').length;
  return keys.reduce((acc, key) => acc + `${key.padEnd(greaterLength)} ${separator} ${obj[<keyof T>key]}\n`, '');
}