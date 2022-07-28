export = <T = any>(array: T[], length: length = 10, groups: T[][] = []) => {
  for (; array.length;) groups.push(array.splice(0, length));

  return groups;
};

/**
 * @default 10
 */
type length = number