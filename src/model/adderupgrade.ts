import { assert } from '../assertions.ts';
import type CatShelter from './catshelter.ts';

/**
 * An additive upgrade that adds to the power of the user's click
 */

export default class AdderUpgrade {
  id?: number
  shelter: CatShelter;
  descriptor: string;
  price: number;
  #addend: number;

  constructor(addend: number, price: number, shelter: CatShelter) {
    this.shelter = shelter;
    this.#addend = addend;
    this.price = price
    this.descriptor = "for now";
    if (this.#addend < 1) {
      throw new InvalidAddendException();
    }
    this.#checkAdderUpgrade();
  }

  #checkAdderUpgrade() {
    assert(this.#addend >= 1, "Addend must be at least 1");
    assert(this.price > 0, "price must be greater than 0");
  }

  applyEffect(base: number) : number {
    this.#checkAdderUpgrade();
    return base + this.#addend;
  }

  get power() {
    return this.#addend;
  }
}

// custom exception for invalid addend property
export class InvalidAddendException extends Error {}