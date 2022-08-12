export = <T extends [string, any][] = [string, any][]>(arrayOfArrays: T, separator = ':') => {
  const greaterLength = arrayOfArrays.reduce((acc, arr) => acc.length > arr[0].length ? acc : arr[0], '').length;
  return arrayOfArrays.reduce((acc, arr) => acc + `${arr[0].padEnd(greaterLength)} ${separator} ${arr[1]}\n`, '');
}