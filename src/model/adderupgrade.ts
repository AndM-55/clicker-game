import { assert } from '../assertions.ts';

export default class AdderUpgrade {
  #addend: number;

  constructor(addend: number) {
    this.#addend = addend;
    this.#checkAdderUpgrade();
  }

  #checkAdderUpgrade() {
    assert(this.#addend > 1, "Addend must be at least 1");
  }

  //maybe dont need this? we will see
  get addend(): number {
    return this.#addend;
  }

  applyEffect(base: number) : number {
    return base + this.#addend;
  }
}