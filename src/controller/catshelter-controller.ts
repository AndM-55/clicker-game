import CatShelter, {
    IncorrectUsernameOrPasswordException,
    InsufficientFundsError
} from "../model/catshelter.ts";
import CatShelterView from "../view/catshelter-view.ts";
import failedPurchaseView from "../view/failed-purchase-view.ts";
import CreateShelterView from "../view/login-create-view.ts";
import CreateOrLoginView from "../view/login-create-view.ts";
import type Upgrade from "../model/upgrade.ts";
import type Building from "../model/building.ts";
import LuxuriousTrap from "../model/luxurious-trap.ts";
import AdderUpgrade from "../model/adderupgrade.ts";
import MultiplierUpgrade from "../model/multiplierupgrade.ts";
import SecondhandTrap from "../model/secondhand-trap.ts";
import ItemView from "../view/item-view.ts";

export default class CatShelterController {
    #catShelter?: CatShelter;
    #itemView?: ItemView;
    #failedPurchaseView?: failedPurchaseView;
    #createOrLoginView?: CreateShelterView;
    #catShelterView?: CatShelterView;
    #upgradeInv?: Array<Upgrade>;
    #buildingInv?: Array<Building>;

    constructor() {
        this.#createOrLoginView = new CreateOrLoginView(this);
    }

    /**
     * due to async conflicts with some of my HTML, I created this function to cache the inventory
     * items, so that methods interacting with the view (e.g., {@link showMultUpgradeDesc}) 
     * behave as intended. These arrays of inventory are stored as instance variables to be accessed as needed
     */
    async cacheInventory(): Promise<void> {
        await Promise.all([
        CatShelter.getUpgradeInventory(this.#catShelter!).then((arr) => {
            this.#upgradeInv = arr;
        }),
        CatShelter.getBuildingInventory(this.#catShelter!).then((arr) => {
            this.#buildingInv = arr;
        })
    ]);
        
    }

    /**
     * this function attempts to login to an account in the database
     * 
     * @param accountName Username the user wants to login with
     * @param password Password provided by user to attempt login
     * @returns a Promise<void>. It seems to be needed in order for 
     * exceptions to be raised properly
     */
    login(accountName: string, password: string): Promise<void> {
        let shelterPromise = CatShelter.getCatShelter(accountName, password);

        return shelterPromise.then((shelter) => {
            this.#catShelter = shelter;
            this.cacheInventory().then(() => {
                this.#createOrLoginView = undefined;
                this.#catShelterView = new CatShelterView(this.#catShelter!, this, this.#upgradeInv!, this.#buildingInv!);
            });

        }).catch(reason => {
            if (reason instanceof IncorrectUsernameOrPasswordException) {
                throw new IncorrectUsernameOrPasswordException();
            } else {
                console.log("unexpected error: " + reason);
            }
        });
    }

    /**
     * this function attempts to make a new account in the system
     * 
     * @param accountName account name provided by user for a new account
     * @param password password provided by user for a new account
     * @returns a Promise<void>. It seemed to be needed in order for 
     * exceptions to be raised properly
     */
    async addShelter(accountName: string, password: string): Promise<void> {

        try {
            let newShelter = await CatShelter.create(accountName, password);
            this.#catShelter = newShelter;
            this.cacheInventory().then(() => {
                this.#createOrLoginView = undefined;
                this.#catShelterView = new CatShelterView(this.#catShelter!, this, this.#upgradeInv!, this.#buildingInv!);
            });
        } catch (e: any) {
            throw e
        }
    }

    /**
     * this function attempts to purchase a {@link LuxuriousTrap} through {@link CatShelter.purchaseBuilding}
     * 
     * in each purchase function within the controller class (there are four total),
     * I recache the inventory to reset the ID's of the instances. If we don't, any subsequent purchase of
     * an item causes the instance to not be persisted. (see {@link CatShelter.saveCatShelter} to understand why)
     * 
     * to reiterate, this cacheInventory() helper function was the easiest solution I could find for 
     * fixing the error of {@link ItemView} conflicting with the async nature of retrieving the inventory
     * items.
     */
    purchaseBuilding(b: Building) {
        let newBuilding = b.copy(b);
        try {
            this.#catShelter!.purchaseBuilding(newBuilding!);
        } catch (e: any) {
            if (e instanceof InsufficientFundsError && this.#failedPurchaseView === undefined) {
                this.#failedPurchaseView = new failedPurchaseView(this);
            }
        }
    }


    /**
     * this function attempts to purchase a {@link AdderUpgrade} through {@link CatShelter.purchaseUpgrade}
     */
    purchaseUpgrade(u: Upgrade): void {
        let newUpgrade = u.copy(u); 
        try {
            this.#catShelter!.purchaseUpgrade(newUpgrade!);
        } catch (error: any) {
            if (error instanceof InsufficientFundsError && this.#failedPurchaseView === undefined) {
                this.#failedPurchaseView = new failedPurchaseView(this);
            }
        }

    }


    /**
     * runs the {@link CatShelter.clickCat} function 
     */
    clickCat() {
        this.#catShelter!.clickCat();
    }

    autoClick() {
        this.#catShelter!.checkTraps();
    }

    /**
     * creates a {@link ItemView} to display the information of {@link MultiplierUpgrade}
     */
    showMultUpgradeDesc() {
        this.#upgradeInv?.forEach(u => {
            if (u instanceof MultiplierUpgrade) {
                this.#itemView = new ItemView(this, u.descriptor, u.price);
            }
        })

    }

    /**
     * creates a {@link ItemView} to display the information of {@link AdderUpgrade}
     */
    showAddUpgradeDesc() {
        this.#upgradeInv?.forEach(u => {
            if (u instanceof AdderUpgrade) {
                this.#itemView = new ItemView(this, u.descriptor, u.price);
            }
        })
    }

    /**
     * creates a {@link ItemView} to display the information of {@link SecondhandTrap}
     */
    showSecondhand() {
        this.#buildingInv?.forEach(b => {
            if (b instanceof SecondhandTrap) {
                this.#itemView = new ItemView(this, b.descriptor, b.price);
            }
        })
    }

    /**
     * creates a {@link ItemView} to display the information of {@link LuxuriousTrap}
     */
    showLuxurious() {
        this.#buildingInv?.forEach(b => {
            if (b instanceof LuxuriousTrap) {
                this.#itemView = new ItemView(this, b.descriptor, b.price);
            }
        })
    }

    /**
     * removes the {@link ItemView} description dialog from the view
     */
    removeItemDesc(): void {
        this.#itemView?.removeDialog();
    }

    resetFailPurchaseView() {
        this.#failedPurchaseView = undefined;
    }

}