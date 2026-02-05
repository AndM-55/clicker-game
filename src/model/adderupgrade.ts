import { assert } from '../assertions.ts';

/**
 * An additive upgrade that adds to the power of the user's click
 */

export default class AdderUpgrade {
  #addend: number;

  constructor(addend: number) {
    this.#addend = addend;
    if (this.#addend < 1) {
      throw new InvalidAddendException();
    }
    this.#checkAdderUpgrade();
  }

  #checkAdderUpgrade() {
    assert(this.#addend >= 1, "Addend must be at least 1");
  }

  applyEffect(base: number) : number {
    return base + this.#addend;
  }

  get addend() {
    return this.#addend;
  }
}

// custom exception for invalid addend property
export class InvalidAddendException extends Error {}