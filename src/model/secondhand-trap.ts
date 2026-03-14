import { assert } from "../assertions";
import type CatShelter from "./catshelter";

export default class SecondhandTrap {
    id?: number;
    shelter: CatShelter;
    descriptor: string;
    price: number;
    efficiency: number

    constructor(shelter: CatShelter, price: number, cps: number) {
        this.efficiency = cps;
        this.descriptor = "for now";
        this.price = price;
        this.shelter = shelter;
        this.#checkTrap();
    }

    #checkTrap() {
        assert(this.efficiency > 1, "Cats per Second must be greater than 1 for buildings")
        assert(this.price >= 1, "Price must be at least 1 for buildings");
    }

    harvestCats() : number {
        return this.efficiency;
    }
}

export class InvalidCPSException extends Error {}