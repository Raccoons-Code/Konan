class ParseMs {
  static ms = 1;
  static s = this.ms * 1000;
  static m = this.s * 60;
  static h = this.m * 60;
  static D = this.h * 24;
  static S = this.D * 7;
  static M = this.D * 30.4375;
  static Y = this.M * 12;

  result?: number | string;

  constructor(public readonly ms: number | string, public readonly options: Options = {}) {
    if (!this.options.levels) {
      this.options.levels = 2;
    }

    if (typeof this.options.sep !== "string") {
      this.options.sep = " ";
    }

    if (typeof ms === "number") {
      this.result = this.formatShort(ms);
    } else {
      this.result = this.parse(ms);
    }
  }

  formatShort(ms: number): string {
    let levels = 0;

    return ["D", "h", "m", "s", "ms"].reduce((acc, val) => {
      const sub = Math.floor(ms / ParseMs[<"s">val]);

      if (!sub) return acc;

      ms -= (sub * ParseMs[<"s">val]);

      if (this.options.levels) {
        if (levels < this.options.levels) {
          levels++;
        } else {
          return acc;
        }
      }

      acc.push(`${sub}${val}`);

      return acc;
    }, <string[]>[]).join(this.options.sep);
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

export default ParseMs;

interface Options {
  /**
   * @default 2
   */
  levels?: number
  /**
   * @default " "
   */
  sep?: string
}
