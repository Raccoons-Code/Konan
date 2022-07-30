export default class Bytes<T extends number> {
  #units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  index: number;
  bytes: string;
  unit: string;

  constructor(public x: T) {
    this.index = this.#index;
    this.bytes = this.#bytes;
    this.unit = this.#unit;
  }

  get #index() {
    if (!this.x) return 0;
    return Math.floor(Math.log(this.x) / Math.log(1000));
  }

  get #bytes() {
    if (!this.x) return '0.00';
    return (this.x / Math.pow(1024, this.index)).toFixed(2);
  }

  get #unit() {
    return this.#units[this.index];
  }

  toArray(): [bytes: number, unit: string] {
    return [Number(this.bytes), this.unit];
  }

  toString() {
    return `${this.bytes} ${this.unit}`;
  }

  toJSON() {
    return {
      bytes: Number(this.bytes),
      unit: this.unit,
    };
  }

  *[Symbol.iterator]() {
    yield* this.toArray();
  }
}

export { Bytes };
