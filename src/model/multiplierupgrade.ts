import { assert } from "../assertions";

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

    getDescription() {
        return "X" + this.#multiplier;
    }

    applyEffect(base: number){
        return base * this.#multiplier;
    }
}

export class InvalidMultiplierExeption extends Error {}