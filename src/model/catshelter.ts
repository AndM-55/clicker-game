import { assert } from "../assertions";
import type Upgrade from "./upgrade";
import type Listener from "./listener";

export default class CatShelter {
    #cats: number;
    #upgrades: Array<Upgrade>;
    #listeners: Array<Listener>;

    #checkCatShelter() {
        assert(this.#cats >= 0, "Number of cats owned must be greater than or equal to zero");
    }

    constructor() {
        this.#cats = 0;
        this.#upgrades = new Array<Upgrade>;
        this.#listeners = new Array<Listener>;
        this.#checkCatShelter();
    }

    get upgrades() {
        return this.#upgrades;
    }

    purchaseUpgrade(myUpgrade: Upgrade) {
        this.#upgrades.push(myUpgrade);
        this.#notifyAll();
    }

    clickCat() : void {
        let base = 1;

        for (let i = 0; i < this.#upgrades.length; i++) {
            let currUpgrade = this.#upgrades[i];
            base = currUpgrade.applyEffect(base);
        }

        this.#cats += base;
        this.#notifyAll();
    }

    get cats() : number {
        return this.#cats
    }

    #notifyAll() {
        this.#listeners.forEach((li) => li.notify())
    }

    registerListener(listener: Listener) {
        this.#listeners.push(listener);
    }
}
