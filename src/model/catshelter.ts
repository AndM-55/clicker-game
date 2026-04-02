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
import seedrandom from 'seedrandom'
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
    #numerator?: number[][];
    #denominator?: number[];
    #currIndexPurchase: number;
    #myRandom: any;

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
        this.#currIndexPurchase = -1; // initially
        this.#myRandom = seedrandom("click")
        this.#getTrainingData()
        this.#checkCatShelter();
    }

    initializeChain(upgradeInv: Array<Upgrade>, buildingInv: Array<Building>) {
        let item
        if (this.#buildings.length > 0) {
            item = this.#buildings[0];
        } else if (this.#upgrades.length > 0) {
            item = this.#upgrades[0];
        } else {
            throw new Error();
        }
        if (item instanceof AdderUpgrade || item instanceof MultiplierUpgrade) {
            for (let i = 0; i < upgradeInv.length; i++) {
                if (upgradeInv[i].name == item!.name) {
                    this.#currIndexPurchase = i;
                    console.log("set the index to " + i)
                }
            }
        } else {
            for (let i = 0; i < buildingInv.length; i++) {
                if (buildingInv[i].name == item!.name) {
                    this.#currIndexPurchase = i + 5
                    console.log("set the index to " + (i+5))
                }
            }
        }
        
    }

    autoBuy(upgradeInv: Array<Upgrade>, buildingInv: Array<Building>) {
        try {
            if (this.#currIndexPurchase < 5) {
                let u = upgradeInv[this.#currIndexPurchase]
                this.purchaseUpgrade(u.copy(u))
            } else {
                let b = buildingInv[this.#currIndexPurchase - 5]
                this.purchaseBuilding(b.copy(b))
            }
            this.#nextSymbol()
        } catch (e: any) {
            if (e instanceof InsufficientFundsError) {
            } else {
                console.log("unexpected error happened while attempting autoBuy in CatShelter")
            }
        }
        
    }

    #nextSymbol() {
        let rand: number = this.#myRandom();
        let sum: number = 0
        let i = this.#currIndexPurchase;
        let j = -1
        let fraction = 0
        while (fraction < rand){
            j++
            
            sum = (sum + this.#numerator![i][j]) 
            fraction = sum/this.#denominator![i]
            console.log(fraction)
        }

        this.#currIndexPurchase = j;
    }

    async #getTrainingData() {
        interface TrainingData {
            numerator: number[][];
            denominator: number[];
        }

        const inputFilePath: string = '/output.json';

        try {
            let response = await fetch(inputFilePath);
            let jsonData: TrainingData = await response.json();
            this.#numerator = jsonData.numerator
            this.#denominator = jsonData.denominator
        } catch (e: any) {
            console.log("unexpected error while getting training data in cat shelter instance")
        }
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
        let shelter = new CatShelter(user, hashPass);
        try {
            shelter = await CatShelter.saveCatShelter(shelter);
        } catch (e: any) {
            throw e;
        }

        return shelter  // calls the constructor before returning 
    }

    /**
     * this method calls a helper method to has a plaintext password
     * 
     * @param salt Username provided by user
     * @param keyMaterial Plaintext provided by user
     * @returns a hashed password
     */
    static async encrypt(salt: string, keyMaterial: string): Promise<string> {
        let hashFunction = hash();
        return hashFunction.hash(salt, keyMaterial);
    }

    /**
     * this function saves to the database when an account/shelter is made
     * 
     * @param shelter the {@link CatShelter} to be persisted
     * @returns a promise of the same shelter that was just persisted
     */
    static async saveCatShelter(shelter: CatShelter): Promise<CatShelter> {
        try {
            await db().query<{ name: string }>("insert into cat_shelter(username, pass, cats) values($1, $2, $3) returning username",
                [shelter.username, shelter.password, shelter.cats]);
        } catch (e: any) {
            throw new UsernameTakenEcxeption()
        }


        return shelter;
    }

    /**
     * this function saves the upgrades of a shelter to the database
     * 
     * @param shelter the shelter whose upgrades will be persisted
     * @returns a promise of the same shelter whose upgrades we just persisted 
     */
    static async saveUpgrades(shelter: CatShelter): Promise<CatShelter> {
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

        return shelter
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
        >("select * from cat_shelter where username = $1",
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
     * this function retrieves all the possible upgrades a user can purchase
     * 
     * @param shelter instance of {@link CatShelter} that we use to construct any {@link Upgrade} instances
     * @returns a promise of an array of upgrades from the database inventory
     */
    static async getUpgradeInventory(shelter: CatShelter): Promise<Array<Upgrade>> {
        let results = await db().query<{
            name: string;
            mechanic: string;
            price: number;
            descriptor: string;
            strength: number;
        }>("select * from upgrade_inventory");

        let upgradesArray = new Array<Upgrade>
        results.rows.forEach(row => {
            if (row.mechanic === "add") {
                upgradesArray.push(new AdderUpgrade(row.mechanic, row.name, row.strength, row.price, shelter, row.descriptor))
            } else {
                upgradesArray.push(new MultiplierUpgrade(row.mechanic, row.name, row.strength, row.price, shelter, row.descriptor))
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
    static async getBuildingInventory(shelter: CatShelter): Promise<Array<Building>> {
        let results = await db().query<{
            name: string
            mechanic: string;
            price: number;
            descriptor: string;
            strength: number;
        }>("select * from building_inventory");

        let buildingsArray = new Array<Building>
        results.rows.forEach(row => {
            if (row.mechanic === "luxurious") {
                buildingsArray.push(new LuxuriousTrap(row.mechanic, row.name, shelter, row.price, row.strength, row.descriptor))
            } else {
                buildingsArray.push(new SecondhandTrap(row.mechanic, row.name, shelter, row.price, row.strength, row.descriptor))
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
            CatShelter.saveUpgrades(this);
            CatShelter.saveCats(this);
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
            CatShelter.saveUpgrades(this);
            CatShelter.saveCats(this);
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

    get currIndexPurchase() {
        return this.#currIndexPurchase
    }

}

export class IncorrectUsernameOrPasswordException extends Error { }
export class UsernameTakenEcxeption extends Error { }
export class InsufficientFundsError extends Error { }
export class InvalidAccountNameException extends Error { }
export class InvalidPasswordException extends Error { }
