export = (array: any[], target: any) => {
  while (array.includes(target))
    array.splice(array.indexOf(target), 1);

  return array;
};