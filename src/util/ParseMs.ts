export default class ParseMs {
  static ms = 1;
  static s = this.ms * 1000;
  static m = this.s * 60;
  static h = this.m * 60;
  static d = this.h * 24;

  declare result: number | string | undefined;

  constructor(ms: number | string) {
    if (typeof ms === "number") {
      this.result = this.formatShort(ms);
    } else {
      this.result = this.parse(ms);
    }
  }

  formatShort(ms: number): string {
    return ["d", "h", "m", "s", "ms"].reduce((acc, val) => {
      const sub = Math.floor(ms / ParseMs[<"s">val]);
      if (!sub) return acc;
      ms -= (sub * ParseMs[<"s">val]);
      acc.push(`${sub}${val}`);
      return acc;
    }, <string[]>[]).join(" ");
  }

  parse(ms: string) {
    const values = ms.match(/(?<value>-?\d+(?:\.\d+)?)\s*(?<type>\w+)?/gi);

    if (!values) return;

    let result = 0;

    for (const iterator of values) {
      const match = iterator.split(/(?<value>-?\d+(?:\.\d+)?)\s*(?<type>\w+)?/i);

      result += Number(match[1]) * ParseMs[<"s">match[2]];
    }

    return result;
  }

  toString() {
    return `${this.result}`;
  }
}
