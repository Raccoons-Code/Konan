export = <T = any>(array: T[], target: T) => {
  while (array.includes(target))
    array.splice(array.indexOf(target), 1);

  return array;
};