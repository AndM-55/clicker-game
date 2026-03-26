import { assert } from "../assertions";
import type CatShelter from "./catshelter";
import type Upgrade from "./upgrade";

/**
 * A multiplicative upgrade that multiplies the power of the users click
 */
export default class MultiplierUpgrade {
    id?: number
    name: string
    shelter: CatShelter;
    descriptor: string;
    #multiplier: number;
    price: number;

    constructor(multiplier: number, price: number, shelter: CatShelter, descriptor: string) {
        this.shelter = shelter;
        this.#multiplier = multiplier;
        this.price = price;
        this.descriptor = descriptor;
        this.name = "Multiplier Upgrade"
        if (this.#multiplier <= 1) {
            throw new InvalidMultiplierExeption();
        }
        this.#checkMultiplierUpgrade();
    }

    #checkMultiplierUpgrade() {
        assert(this.#multiplier >= 2, "multiplier must be at lease two for a multiplier upgrade");
        assert(this.price > 0, "price must be greater than 0");
    }

    /**
     * multiplies the current click by its multiplier variable
     * 
     * @param base the current click power that will end up being added to the {@link CatShelter}
     * @returns a number that was modified by the multiplier of this upgrade
     */
    applyEffect(base: number) {
        this.#checkMultiplierUpgrade();
        return base * this.#multiplier;
    }

    get power() {
        return this.#multiplier;
    }

    /**
    * this function deep copies an instance of an upgrade
    * 
    * @param u instance to be deep copied
    * @returns the deep copy 
    */
    copy(u: Upgrade): MultiplierUpgrade {
        let newUpgrade = new MultiplierUpgrade(u.power, u.price, u.shelter, u.descriptor)
        return newUpgrade;
    }

}

// custom exception for invalid multiplier property
export class InvalidMultiplierExeption extends Error { }