import { assert } from "../assertions";
import type Upgrade from "./upgrade";
import type Listener from "./listener";
/**
 * The Cat shelter object that currently serves as the entire state of the game 
 */
export default class CatShelter {
    #cats: number;
    #upgrades: Array<Upgrade>;
    #listeners: Array<Listener>;


    constructor() {
        this.#cats = 0;
        this.#upgrades = new Array<Upgrade>;
        this.#listeners = new Array<Listener>;
        this.#checkCatShelter();
    }

    #checkCatShelter() {
        assert(this.#cats >= 0, "Number of cats owned must be greater than or equal to zero");
    }

    #notifyAll() {
        this.#listeners.forEach((li) => li.notify())
    }

    purchaseUpgrade(myUpgrade: Upgrade) {
        this.#upgrades.push(myUpgrade);
        this.#notifyAll();
    }

    /**
     * this function runs the base click (1) through all upgrades in the array
     * and adds the final number to the cats property
     */
    clickCat() : void {
        this.#checkCatShelter();
        let base = 1;

        for (let i = 0; i < this.#upgrades.length; i++) {
            let currUpgrade = this.#upgrades[i];
            base = currUpgrade.applyEffect(base);
        }

        this.#cats += base;
        this.#checkCatShelter();
        this.#notifyAll();
    }

    registerListener(listener: Listener) {
        this.#listeners.push(listener);
    }

    get cats() : number {
        return this.#cats
    }

    get upgrades() {
        return this.#upgrades;
    }
}
