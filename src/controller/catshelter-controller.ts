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

export class CatShelterController {
    #catShelter?: CatShelter;
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
     * this function attempts to purchase a {@link Building} through {@link CatShelter.purchaseBuilding}
     * 
     * @param b is the building we want to add, with a caveat: 
     *      the view hands this instance to the controller, but in order to ensure it's
     *      treated as a new instane without an ID (for proper persisting)
     *      we make a deep copy of this type of building. Otherwise {@link LuxuriousTrap.saveBuilding}
     *      gives an ID to the inventory instance in the view, and that instance won't be persisted anymore when 
     *      the view passes it.
     *      
     */
    purchaseBuilding(b: Building) {
        let newBuilding = b.copy(b);
        try {
            this.#catShelter!.purchaseBuilding(newBuilding!);
        } catch (e: any) {
            if (e instanceof InsufficientFundsError && this.#failedPurchaseView === undefined) {
                this.#failedPurchaseView = new failedPurchaseView(this, "insufficient funds. get more cats first");
            }
        }
    }


    /**
     * this function attempts to purchase a {@link Upgrade} through {@link CatShelter.purchaseUpgrade}
     * 
     * @param u is the upgrade we want to add, with a similar caveat to {@link purchaseBuilding}   
     */
    purchaseUpgrade(u: Upgrade): void {
        let newUpgrade = u.copy(u);
        try {
            this.#catShelter!.purchaseUpgrade(newUpgrade!);
        } catch (error: any) {
            if (error instanceof InsufficientFundsError && this.#failedPurchaseView === undefined) {
                this.#failedPurchaseView = new failedPurchaseView(this, "insufficient funds. get more cats first");
            }
        }

    }

    /**
     * this function attempts to auto purchase the current item that the account instance should auto purchase
     * based on the trained model's decision
     */
    autoBuy() {
        try {
            this.#catShelter!.autoBuy(this.#upgradeInv!, this.#buildingInv!)
        } catch (e: any) {}
    }


    /**
     * runs the {@link CatShelter.clickCat} function 
     */
    clickCat() {
        this.#catShelter!.clickCat();
    }

    /**
     * this function calls the check traps function from {@link CatShelter}
     */
    autoClick() {
        this.#catShelter!.checkTraps();
    }

    // this function resets the failed purchase instance variable. necessary for deciding when to create this view 
    resetFailPurchaseView() {
        this.#failedPurchaseView = undefined;
    }

}