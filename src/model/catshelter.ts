import { assert } from "../assertions";
import { hash } from "./connection";
import type Upgrade from "./upgrade";
import type Listener from "./listener";
import type Building from "./building";
import db from "./connection";
import AdderUpgrade from "./adderupgrade";
import LuxuriousTrap from "./luxurious-trap";
import MultiplierUpgrade from "./multiplierupgrade";
import SecondhandTrap from "./secondhand-trap";
/**
 * The Cat shelter account that serves as the entire state of the game 
 */
export default class CatShelter {
    #userName: string;
    #password!: string;
    #cats: number;
    #upgrades: Array<Upgrade>;
    #buildings: Array<Building>;
    #listeners: Array<Listener>;

    #checkCatShelter() {
        assert(this.#cats >= 0, "Number of cats owned must be greater than or equal to zero");
    }

    #notifyAll() {
        this.#listeners.forEach((li) => li.notify())
    }

    constructor(user: string, pass: string) {
        this.#userName = user;
        this.#password = pass
        this.#cats = 0;
        this.#upgrades = new Array<Upgrade>;
        this.#buildings = new Array<Building>;
        this.#listeners = new Array<Listener>;
        this.#checkCatShelter();
    }

    /**
     * Async builder method that does the heavy lifting for the password encryption
     * 
     * @param user Username provided by user for a new account
     * @param pass Password provided by user for a new account
     * @returns Promise of type {@link CatShelter}
     */
    static async create(user: string, pass: string): Promise<CatShelter> {
        if (user.length < 1) {
            throw new InvalidAccountNameException();
        }
        if (pass.length < 1) {
            throw new InvalidPasswordException();
        }

        let hashPass = await CatShelter.encrypt(user, pass);

        return new CatShelter(user, hashPass); // calls the constructor before returning 
    }

    /**
     * this method calls a helper method to has a plaintext password
     * 
     * @param salt Username provided by user
     * @param keyMaterial Plaintext provided by user
     * @returns a hashed password
     */
    static async encrypt(salt: string, keyMaterial: string) : Promise<string> {
        let hashFunction = hash();
        return hashFunction.hash(salt, keyMaterial);
    }

    /**
     * this function saves the current state of an account/shelter when a shelter is made
     * or when an upgrade/building is purchased
     * 
     * @param shelter the {@link CatShelter} to be persisted
     * @returns a promise of the same shelter that was just persisted
     */
    static async saveCatShelter(shelter: CatShelter): Promise<CatShelter> {
        await db().query<{ name: string }>("insert into cat_shelter(username, pass, cats) values($1, $2, $3) on conflict do nothing returning username",
            [shelter.username, shelter.password, shelter.cats]
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

    /**
     * this function saves the number of clicks(cats) in response to a manual OR auto click.
     * 
     * this function is separate from {@link CatShelter.saveCatShelter} because,
     * before it was added, {@link CatShelter.purchaseBuilding} and 
     * {@link CatShelter.checkTraps} (autoclick) would call saveCatShelter at 
     * the same time. With just the wrong timing, this would lead to a single 
     * upgrade purchase being persisted twice (bad!)
     * 
     * @param shelter the shelter for which the number of clicks (cats) should be updated/saved
     * @returns a promise of the cat shelter that was updated in the database
     */
    static async saveCats(shelter: CatShelter): Promise<CatShelter> {
        await db().query<{ name: string }>("update cat_shelter set pass=$1, cats=$2 where username=$3",
            [shelter.password, shelter.cats, shelter.username]
        );

        return shelter;
    }

    /**
     * this function retrieves an account/shelter from the database to attempt to login with
     * 
     * @param accountName Username provided by user that they want to attempt login for
     * @param password Password provided by user to unlock the account
     * @returns a promise of the catshelter that was retrieved from the database
     */
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
            let encryptPromise = await CatShelter.encrypt(row!.username, password);
            
            if (encryptPromise !== row!.pass) {
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

    /**
     * this function checks if a Username from the user is available to be used for a new account
     * 
     * @param accountName Username provided by user that they are attempting to create an account with
     * @returns promise of a boolean that evaluates whether the name can be used for a new account
     */
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

    /**
     * this function retrieves all the possible upgrades a user can purchase
     * 
     * @param shelter instance of {@link CatShelter} that we use to construct any {@link Upgrade} instances
     * @returns a promise of an array of upgrades from the database inventory
     */
    static async getUpgradeInventory(shelter: CatShelter) : Promise<Array<Upgrade>> {
        let results = await db().query<{ 
            mechanic: string;
            price: number;
            descriptor: string;
            strength: number;
        }>("select * from upgrade_inventory");

        let upgradesArray = new Array<Upgrade>
        results.rows.forEach(row => {
            if (row.mechanic === "add") {
                upgradesArray.push(new AdderUpgrade(row.strength, row.price, shelter, row.descriptor))
            } else {
                upgradesArray.push(new MultiplierUpgrade(row.strength, row.price, shelter, row.descriptor))
            }
        });
        return upgradesArray;
    }

    /**
     * this function retrieves all the possible buildings a user can purchase
     * 
     * @param shelter instance of {@link CatShelter} that we use to construct any {@link Building} instances
     * @returns a promise of an array of buildings from the database inventory
     */
    static async getBuildingInventory(shelter: CatShelter) : Promise<Array<Building>> {
        let results = await db().query<{ 
            mechanic: string;
            price: number;
            descriptor: string;
            strength: number;
        }>("select * from building_inventory");

        let buildingsArray = new Array<Building>
        results.rows.forEach(row => {
            if (row.mechanic === "luxurious") {
                buildingsArray.push(new LuxuriousTrap(shelter, row.price, row.strength, row.descriptor))
            } else {
                buildingsArray.push(new SecondhandTrap(shelter, row.price, row.strength, row.descriptor))
            }
        });
        return buildingsArray;
    }

    /**
     * this function attempts to purchase an upgrade for the {@link CatShelter}
     * 
     * @param myUpgrade instance of {@link Upgrade} to be purchased
     */
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

    /**
     * this function attempts to purchase an upgrade for the {@link CatShelter}
     * 
     * @param myBuilding instance of {@link Building} to be purchased
     */
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
        CatShelter.saveCats(this);
        this.#notifyAll();
    }

    /**
     * this function adds cats to the account by adding 
     * all the efficiencies from each building in the current collection 
     * every second 
     */
    checkTraps() {
        this.#checkCatShelter();
        let bountifulHarvest = 0;

        for (let u of this.#buildings) {
            bountifulHarvest += u.harvestCats();
        }

        this.#cats += bountifulHarvest;
        this.#checkCatShelter();
        if (bountifulHarvest > 0) {
            CatShelter.saveCats(this);
        }
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
