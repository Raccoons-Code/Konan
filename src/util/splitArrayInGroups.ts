export = (array: any[], length: length = 10) => {
  const groups = [];

  for (let i = 0; i < array.length; i += length) { groups.push(array.slice(i, (i + length))); }

  return groups;
};

/**
 * @default 10
 */
type length = number