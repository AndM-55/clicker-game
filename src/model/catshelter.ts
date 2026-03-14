import { assert } from "../assertions";
import type Upgrade from "./upgrade";
import type Listener from "./listener";
import type Building from "./building";
/**
 * The Cat shelter object that currently serves as the entire state of the game 
 */
export default class CatShelter {
    #userName: string;
    #password: string;
    #cats: number;
    #upgrades: Array<Upgrade>;
    #buildings: Array<Building>;
    #listeners: Array<Listener>;


    constructor(user: string, pass: string) {
        if (user.length < 1) {
            throw new InvalidAccountNameException();
        }
        if (pass.length < 1) {
            throw new InvalidPasswordException();
        }
        this.#userName = user;
        this.#password = pass;
        this.#cats = 0;
        this.#upgrades = new Array<Upgrade>;
        this.#buildings = new Array<Building>;
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
        if (myUpgrade.price > this.#cats) {
            throw new InsufficientFundsError();
        } else {
            this.#cats = this.#cats - myUpgrade.price;
            this.#upgrades.push(myUpgrade);
            this.#notifyAll();
        }
        
    }

    purchaseBuilding(myBuilding: Building) {
        if (myBuilding.price > this.#cats) {
            throw new InsufficientFundsError();
        } else {
            this.#cats = this.#cats - myBuilding.price;
            this.#buildings.push(myBuilding);
            this.#notifyAll();
        }
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

    checkTraps() {
        this.#checkCatShelter();
        let bountifulHarvest = 0;

        for (let u of this.#buildings) {
            bountifulHarvest += u.harvestCats();
        }

        this.#cats += bountifulHarvest;
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

    get buildings() {
        return this.#buildings;
    }

    get username() {
        return this.#userName;
    }
}

export class InsufficientFundsError extends Error {}
export class InvalidAccountNameException extends Error {}
export class InvalidPasswordException extends Error {}
