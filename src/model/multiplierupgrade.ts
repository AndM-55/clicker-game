import { assert } from "../assertions";

/**
 * A multiplicative upgrade that multiplies the power of the users click
 */

export default class MultiplierUpgrade {
    #multiplier: number;

    constructor(multiplier: number) {
        this.#multiplier = multiplier;
        if (this.#multiplier <= 1) {
            throw new InvalidMultiplierExeption();
        }
        this.#checkMultiplierUpgrade();
    }

    #checkMultiplierUpgrade() {
        assert(this.#multiplier >= 2, "multiplier must be at lease two for a multiplier upgrade");
    }

    applyEffect(base: number){
        this.#checkMultiplierUpgrade();
        return base * this.#multiplier;
    }

    get multiplier() {
        return this.#multiplier;
    }

}

// custom exception for invalid multiplier property
export class InvalidMultiplierExeption extends Error {}