export = <T = any>(object: any, keys: (number | string)[]) => keys.reduce((acc: any, key) => {
  if (typeof object[key] !== 'undefined')
    acc[key] = object[key];

  return acc;
}, <T>{});