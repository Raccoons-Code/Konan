export = (...fns: ((value?: any) => any)[]) => (value: any) => fns.reduce((acc, fn) => fn(acc), value);
