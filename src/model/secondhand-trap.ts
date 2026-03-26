import { assert } from "../assertions";
import type CatShelter from "./catshelter";
import type Building from "./building";
/**
 * Second hand cat trap, likely from facebook marketplace or something. its not very good 
 * but it passively collects cats for the current {@link CatShelter}
 */
export default class SecondhandTrap {
    id?: number;
    name: string;
    shelter: CatShelter;
    descriptor: string;
    price: number;
    efficiency: number

    constructor(shelter: CatShelter, price: number, cps: number, descriptor: string) {
        this.efficiency = cps;
        this.descriptor = descriptor;
        this.price = price;
        this.shelter = shelter;
        this.name = "Secondhand Trap"
        this.#checkTrap();
    }

    #checkTrap() {
        assert(this.efficiency > 1, "Cats per Second must be greater than 1 for buildings")
        assert(this.price >= 1, "Price must be at least 1 for buildings");
    }

    /**
     * gets the number of cats to be added to the {@link CatShelter} instance
     * 
     * @returns the efficiency of the building, i.e., the number of cats that it will add in one second
     */
    harvestCats(): number {
        return this.efficiency;
    }

    copy(b: Building): SecondhandTrap {
        return new SecondhandTrap(b.shelter, b.price, b.efficiency, b.descriptor)
    }
}

export class InvalidCPSException extends Error { }