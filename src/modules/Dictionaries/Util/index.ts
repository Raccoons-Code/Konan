export default abstract class Util {
  static formatLocale(str: string) {
    return str.replace('-', '_');
  }

  static filterInvalidChars(data: string[], wordSize?: number) {
    const regex = new RegExp(`^[a-z]${wordSize ? `{${wordSize}}` : '+'}$`, 'i');

    const array: string[] = [];

    for (let i = 0; i < data.length; i++) {
      const str = this.mapInvalidChars(data[i].split('/')[0]);

      if (regex.test(str))
        array.push(str);
    }

    return array;
  }

  static limitWordsSize(data: string[], wordSize?: number) {
    const regex = new RegExp(`^[a-z]${wordSize ? `{${wordSize}}` : '+'}$`, 'i');

    return data.filter(str => regex.test(str));
  }

  static mapInvalidChars(str: string) {
    return str.replace(/[ãâáàä]/gi, 'a')
      .replace(/[êéèë]/gi, 'e')
      .replace(/[îíìï]/gi, 'i')
      .replace(/[õôóòö]/gi, 'o')
      .replace(/[ûúùü]/gi, 'u')
      .replace(/[ç]/gi, 'c');
  }
}