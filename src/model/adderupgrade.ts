import { assert } from '../assertions.ts';

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

  //maybe dont need this? we will see
  getDescription(): string {
    return "+" + this.#addend;
  }

  applyEffect(base: number) : number {
    return base + this.#addend;
  }
}

export class InvalidAddendException extends Error {}