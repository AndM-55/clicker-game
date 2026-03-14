import AdderUpgrade from "../model/adderupgrade.ts";
import CatShelter, { InsufficientFundsError } from "../model/catshelter.ts";
import MultiplierUpgrade from "../model/multiplierupgrade.ts";
import CatShelterView from "../view/catshelter-view.ts";
import upgradeView from "../view/upgrade-view.ts";
import failedPurchaseView from "../view/failed-purchase-view.ts";
import CreateShelterView from "../view/create-shelter-view.ts";
import LuxuriousTrap from "../model/luxurious-trap.ts";
import SecondhandTrap from "../model/secondhand-trap.ts";

/**
 * this class is the controller for the cat shelter. 
 * 
 * it takes inputs from view and makes changes to the model when asked
 */
export default class CatShelterController {
    #catShelter?: CatShelter;
    #upgradeView?: upgradeView;
    #failedPurchaseView?: failedPurchaseView;
    #createShelterView?: CreateShelterView;
    #catShelterView?: CatShelterView;

    constructor() {
        this.#createShelterView = new CreateShelterView(this);
    }

    startAutoClick() {
        setInterval(() => {
            this.#catShelter!.checkTraps();
        }, 1000);
    }

    addShelter(accountName: string, password: string) {
        this.#catShelter = new CatShelter(accountName, password);
        this.#createShelterView = undefined;
        this.#catShelterView = new CatShelterView(this.#catShelter, this);
    }

    purchaseLuxuriousTrap() {
        let l = new LuxuriousTrap(this.#catShelter!, 50, 10);
        try {
            this.#catShelter!.purchaseBuilding(l);
        } catch (e: any) {
            if (e instanceof InsufficientFundsError && this.#failedPurchaseView === undefined) {
                this.#failedPurchaseView = new failedPurchaseView(this);
            }
        }
    }

    purchaseSecondhandTrap() {
        let s = new SecondhandTrap(this.#catShelter!, 20, 2);
        try {
            this.#catShelter!.purchaseBuilding(s);
        } catch (e: any) {
            if (e instanceof InsufficientFundsError && this.#failedPurchaseView === undefined) {
                this.#failedPurchaseView = new failedPurchaseView(this);
            }
        }
    }

    // methods that mutate domain model
    purchaseAdderUpgrade(): void {
        let a = new AdderUpgrade(3, 10, this.#catShelter!);
        try {
            this.#catShelter!.purchaseUpgrade(a);
        } catch (error: any) {
            if (error instanceof InsufficientFundsError && this.#failedPurchaseView === undefined) {
                this.#failedPurchaseView = new failedPurchaseView(this);
            }
        }
    }

    purchaseMultiplierUpgrade(): void {
        let m = new MultiplierUpgrade(2, 10, this.#catShelter!);
        try {
            this.#catShelter!.purchaseUpgrade(m);
        } catch (error: any) {
            if (error instanceof InsufficientFundsError && this.#failedPurchaseView === undefined) {
                this.#failedPurchaseView = new failedPurchaseView(this);
            }
        }

    }

    clickCat() {
        this.#catShelter!.clickCat();
    }

    showMultUpgradeDesc(): void {
        this.#upgradeView = new upgradeView(this, "multiply click power by 2");
    }
    // I want this literal to come from a database inventory instead

    showAddUpgradeDesc(): void {
        this.#upgradeView = new upgradeView(this, "add 3 to click power");
    }

    removeUpgradeDesc(): void {
        this.#upgradeView?.removeDialog();
    }

    resetFailPurchaseView() {
        this.#failedPurchaseView = undefined;
    }

}