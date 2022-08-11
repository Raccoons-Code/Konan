const defaults: Options = {
  prefix: '',
  suffix: '',
};

function limitArrayByStringLength<T = string>(
  array: T[],
  strlen: number,
  options?: Options & { convertToString: true }
): string
function limitArrayByStringLength<T = string>(array: T[], strlen: number, options?: Options): T[]
function limitArrayByStringLength<T = string>(array: T[], strlen: number, options?: Options) {
  options = { ...defaults, ...options };

  const result = [];

  for (let i = 0; i < array.length; i++) {
    const item = `${options.prefix}${array[i]}${options.suffix}`;

    if ((result.join(options.separator).length + item.length) > strlen) break;

    result.push(item);
  }

  if (options.convertToString)
    return result.join(options.separator);

  return result;
}

export default limitArrayByStringLength;
export { limitArrayByStringLength };

interface Options {
  convertToString?: boolean;
  prefix?: string;
  separator?: string;
  suffix?: string;
}