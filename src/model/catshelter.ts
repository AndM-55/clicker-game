import { assert } from "../assertions";
import type Upgrade from "./upgrade";
import type Listener from "./listener";
import type Building from "./building";
import db from "./connection";
import AdderUpgrade from "./adderupgrade";
import LuxuriousTrap from "./luxurious-trap";
import MultiplierUpgrade from "./multiplierupgrade";
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

    static async saveCatShelter(shelter: CatShelter): Promise<CatShelter> {

        await db().query<{ name: string }>("insert into cat_shelter(username, pass, cats) values($1, $2, $3) on conflict do nothing returning username",
            [shelter.username, shelter.password, shelter.cats]
        );
        await db().query<{ name: string }>("update cat_shelter set pass=$1, cats=$2 where username=$3",
            [shelter.password, shelter.cats, shelter.username]
        );

        shelter.upgrades.forEach((upgrade) => {
            if (!upgrade.id) {
                AdderUpgrade.saveUpgrade(upgrade);
            }
        });

        shelter.buildings.forEach((building) => {
            if (!building.id) {
                LuxuriousTrap.saveBuilding(building);
            }
        });

        return shelter;
    }

    static async getCatShelter(accountName: string, password: string): Promise<CatShelter> {
        let results = await db().query<
            {
                username: string,
                pass: string,
                cats: number,
            }
        >("select username, pass, cats from cat_shelter where username = $1",
            [accountName]);

        let shelter;

        if (results.rows.length === 0) {
            throw new IncorrectUsernameOrPasswordException();
        } else {
            let row = results.rows.at(0);

            if (row!.pass !== password) {
                throw new IncorrectUsernameOrPasswordException()
            } else {
                shelter = new CatShelter(row!.username, row!.pass);
                let upgrades = await AdderUpgrade.getUpgradesForShelter(shelter);
                for (let upgrade of upgrades) {
                    shelter.upgrades.push(upgrade);
                }
                let buildings = await LuxuriousTrap.getBuildingsForShelter(shelter);
                for (let building of buildings) {
                    shelter.buildings.push(building);
                }
                shelter.cats = row!.cats;
            }
        }
        return shelter!;
    }

    static async checkNameVacant(accountName: string): Promise<boolean> {

        let bool = undefined
        let results = await db().query<
            {
                username: string,
            }
        >("select username from cat_shelter where username = $1",
            [accountName]);
        if (results.rows.length === 0) {
            bool = true;
        } else {
            bool = false;
        }
        return bool;
    }

    static async getAdderUpgrade(shelter: CatShelter) : Promise<Upgrade> {
        let results = await db().query<{ 
            mechanic: string;
            price: number;
            descriptor: string;
            strength: number;
        }>("select mechanic, price, descriptor, strength from inventory where mechanic='addclick'")

        let row = results.rows[0];
        return new AdderUpgrade(row.strength, row.price, shelter, row.descriptor);
    }

    static async getMultUpgrade(shelter: CatShelter) : Promise<Upgrade> {
        let results = await db().query<{ 
            mechanic: string;
            price: number;
            descriptor: string;
            strength: number;
        }>("select mechanic, price, descriptor, strength from inventory where mechanic='multclick'")

        let row = results.rows[0];
        return new MultiplierUpgrade(row.strength, row.price, shelter, row.descriptor);
    }

    static async getLuxuriousTrap(shelter: CatShelter) : Promise<Building> {
        let results = await db().query<{ 
            mechanic: string;
            price: number;
            descriptor: string;
            strength: number;
        }>("select mechanic, price, descriptor, strength from inventory where mechanic='luxurious'")

        let row = results.rows[0];
        return new LuxuriousTrap(shelter, row.price, row.strength, row.descriptor);
    }

    static async getSecondhandTrap(shelter: CatShelter) : Promise<Building> {
        let results = await db().query<{ 
            mechanic: string;
            price: number;
            descriptor: string;
            strength: number;
        }>("select mechanic, price, descriptor, strength from inventory where mechanic='secondhand'")

        let row = results.rows[0];
        return new LuxuriousTrap(shelter, row.price, row.strength, row.descriptor);
    }

    purchaseUpgrade(myUpgrade: Upgrade) {
        if (myUpgrade.price > this.#cats) {
            throw new InsufficientFundsError();
        } else {
            this.#cats = this.#cats - myUpgrade.price;
            this.#upgrades.push(myUpgrade);
            CatShelter.saveCatShelter(this);
            this.#notifyAll();
        }

    }

    purchaseBuilding(myBuilding: Building) {
        if (myBuilding.price > this.#cats) {
            throw new InsufficientFundsError();
        } else {
            this.#cats = this.#cats - myBuilding.price;
            this.#buildings.push(myBuilding);
            CatShelter.saveCatShelter(this);
            this.#notifyAll();
        }
    }

    /**
     * this function runs the base click (1) through all upgrades in the array
     * and adds the final number to the cats property
     */
    clickCat(): void {
        this.#checkCatShelter();
        let base = 1;

        for (let i = 0; i < this.#upgrades.length; i++) {
            let currUpgrade = this.#upgrades[i];
            base = currUpgrade.applyEffect(base);
        }

        this.#cats += base;
        this.#checkCatShelter();
        CatShelter.saveCatShelter(this);
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
        CatShelter.saveCatShelter(this);
        this.#notifyAll();
    }

    registerListener(listener: Listener) {
        this.#listeners.push(listener);
    }

    get cats(): number {
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

    get password() {
        return this.#password;
    }

    set cats(num: number) {
        this.#cats = num;
    }
}

export class IncorrectUsernameOrPasswordException extends Error { }
export class UsernameTakenEcxeption extends Error { }
export class InsufficientFundsError extends Error { }
export class InvalidAccountNameException extends Error { }
export class InvalidPasswordException extends Error { }
