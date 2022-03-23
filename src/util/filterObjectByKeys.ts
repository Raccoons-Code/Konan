export = (object: any, keys: string[]) => keys.reduce((acc: any, key) => {
  if (typeof object[key] !== 'undefined')
    acc[key] = object[key];

  return acc;
}, {});