import regexp from './regexp';

export = (value: any) => typeof value === 'function' && regexp.isClass.test(value.toString())