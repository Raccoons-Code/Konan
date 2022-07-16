/**
 * Data structure that makes it easy to interact with a bitfield.
 */
class BitField<S extends string, N extends bigint> {
  /**
   * Bitfield of the packed bits
   */
  bitField: bigint | N;

  static DefaultBit = 0n;

  /**
   * Numeric bitfield flags.
   * <info>Defined in extension classes</info>
   */
  static Flags: EnumLike<any, bigint> = {};

  constructor(bits: BitFieldResolvable<S, N> = <N>BitField.DefaultBit) {
    this.bitField = this.#_constructor.resolve(bits);
  }

  get #_constructor() {
    return this.constructor as typeof BitField;
  }

  /**
   * Checks whether the bitfield has a bit, or any of multiple bits.
   * @param bits Bit(s) to check for
   */
  any(...bits: BitFieldResolvable<S, N>[]) {
    return (this.bitField & this.#_constructor.resolve(bits)) !== this.#_constructor.DefaultBit;
  }

  /**
   * Checks if this bitfield equals another
   * @param bits Bit(s) to check for
   */
  equals(...bits: BitFieldResolvable<S, N>[]) {
    return this.bitField === this.#_constructor.resolve(bits);
  }

  /**
   * Checks whether the bitfield has a bit, or multiple bits.
   * @param bits Bit(s) to check for
   */
  has(...bits: BitFieldResolvable<S, N>[]) {
    const bit = this.#_constructor.resolve(bits) as N;
    return (this.bitField & bit) === bit;
  }

  /**
   * Gets all given bits that are missing from the bitfield.
   * @param bits Bit(s) to check for
   */
  missing(...bits: BitFieldResolvable<S, N>[]): S[] {
    return new this.#_constructor(bits).remove(this).toArray() as S[];
  }

  /**
   * Freezes these bits, making them immutable.
   */
  freeze(): Readonly<BitField<S, N>> {
    return Object.freeze(this);
  }

  /**
   * Adds bits to these ones.
   * @param bits Bits to add
   * @returns These bits or new BitField if the instance is frozen.
   */
  add(...bits: BitFieldResolvable<S, N>[]) {
    const total = bits.reduce((prev, p) => prev | this.#_constructor.resolve(p), this.#_constructor.DefaultBit);

    if (Object.isFrozen(this)) return new this.#_constructor(this.bitField | total);

    this.bitField |= total;

    return this;
  }

  /**
   * Removes bits from these.
   * @param bits Bits to remove
   * @returns These bits or new BitField if the instance is frozen.
   */
  remove(...bits: BitFieldResolvable<S, N>[]) {
    const total = bits.reduce((prev, p) => prev | this.#_constructor.resolve(p), this.#_constructor.DefaultBit);

    if (Object.isFrozen(this)) return new this.#_constructor(this.bitField & ~total);

    this.bitField &= ~total;

    return this;
  }

  /**
   * Gets an object mapping field names to a {@link boolean} indicating whether the
   * bit is available.
   */
  serialize() {
    return Object.entries(this.#_constructor.Flags)
      .reduce((acc, [flag, bit]) => ({ ...acc, [flag]: this.has(<N>bit) }),
        <Record<S, false | true>>{});
  }

  /**
   * Gets an {@link Array} of bitfield names based on the bits available.
   */
  toArray(): S[] {
    return Object.keys(this.#_constructor.Flags).filter(bit => this.has(<S>bit)) as S[];
  }

  toJSON() {
    return typeof this.bitField === 'number' ? this.bitField : this.bitField.toString();
  }

  valueOf() {
    return this.bitField as N;
  }

  *[Symbol.iterator]() {
    yield* this.toArray();
  }

  /**
   * Resolves bitfields to their numeric form.
   * @param bit bit(s) to resolve
   */
  static resolve(bit: BitFieldResolvable<string, bigint>): bigint {
    const { DefaultBit } = this;

    if (Array.isArray(bit)) return bit.reduce((prev: bigint, p) => prev | this.resolve(p), DefaultBit);

    if (typeof DefaultBit === typeof bit && bit >= DefaultBit) return BigInt(<bigint>bit);

    if (bit instanceof BitField) return bit.bitField;

    if (typeof bit === 'string') {
      if (typeof this.Flags[bit] !== 'undefined') return BigInt(this.Flags[bit]);

      if (!isNaN(Number(bit))) return typeof DefaultBit === 'bigint' ? BigInt(bit) : BigInt(bit);
    }
    throw new RangeError('Invalid BitField');
  }
}

/**
 * Data that can be resolved to give a bitfield. This can be:
 * * A bit number (this can be a number literal or a value taken from {@link BitField.Flags})
 * * A string bit number
 * * An instance of BitField
 * * An Array of BitFieldResolvable
 */
export type BitFieldResolvable<S extends string, N extends bigint> =
  | `${bigint}`
  | BitField<S, N>
  | BitFieldResolvable<S, N>[]
  | N
  | S;

type EnumLike<E, V> = Record<keyof E, V>

export default BitField;