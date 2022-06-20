export = (value: any) => typeof value === 'function' &&
  /^((?:class\s*)(\s+(?!extends)\S+\s*)?(?:(?:\s+extends)(\s+\S+\s*))?){/.test(value.toString())