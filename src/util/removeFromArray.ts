export = <T = any>(array: T[], target: T | T[]) => {
  if (Array.isArray(target))
    return array.filter(item => !target.includes(item));

  while (array.includes(target))
    array.splice(array.indexOf(target), 1);

  return array;
}