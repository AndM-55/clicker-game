import CatShelter, { IncorrectUsernameOrPasswordException, InsufficientFundsError, UsernameTakenEcxeption } from "../model/catshelter.ts";
import CatShelterView from "../view/catshelter-view.ts";
import upgradeView from "../view/upgrade-view.ts";
import failedPurchaseView from "../view/failed-purchase-view.ts";
import CreateShelterView from "../view/login-create-view.ts";
import CreateOrLoginView from "../view/login-create-view.ts";
import type Upgrade from "../model/upgrade.ts";

/**
 * this class is the controller for the cat shelter. 
 * 
 * it takes inputs from view and makes changes to the model when asked
 */
export default class CatShelterController {
    #catShelter?: CatShelter;
    #upgradeView?: upgradeView;
    #failedPurchaseView?: failedPurchaseView;
    #createOrLoginView?: CreateShelterView;
    #catShelterView?: CatShelterView;
    #invAdder?: Upgrade;
    #invMult?: Upgrade;

    constructor() {
        this.#createOrLoginView = new CreateOrLoginView(this);
    }

    startAutoClick() {
        setInterval(() => {
            this.#catShelter!.checkTraps();
        }, 1000);
    }

    async cacheInventory() : Promise<void> {
        let adderPromise = await CatShelter.getAdderUpgrade(this.#catShelter!)
        this.#invAdder = adderPromise;
        
        let multPromise = await CatShelter.getMultUpgrade(this.#catShelter!)
        this.#invMult = multPromise
    }

    login(accountName: string, password: string) {
        let shelterPromise = CatShelter.getCatShelter(accountName, password);

        return shelterPromise.then((shelter) => {
            this.#catShelter = shelter;
            this.cacheInventory();
            this.#createOrLoginView = undefined;
            this.#catShelterView = new CatShelterView(this.#catShelter, this);
        }).catch(reason => {
            if (reason instanceof IncorrectUsernameOrPasswordException) {
                throw new IncorrectUsernameOrPasswordException();
            } else {
                console.log("unexpected error: " + reason);
            }
        });
    }

    addShelter(accountName: string, password: string) {
        let nameVacancyPromise = CatShelter.checkNameVacant(accountName);
        return nameVacancyPromise.then((value) => {
            if (value) {
                this.#catShelter = new CatShelter(accountName, password);
                this.cacheInventory();
                this.#createOrLoginView = undefined;
                this.#catShelterView = new CatShelterView(this.#catShelter, this);
                CatShelter.saveCatShelter(this.#catShelter);
            } else {
                throw new UsernameTakenEcxeption();
            }
        })
    }

    purchaseLuxuriousTrap() {
        let luxuryPromise = CatShelter.getLuxuriousTrap(this.#catShelter!);
        luxuryPromise.then(l => {
            try {
                this.#catShelter!.purchaseBuilding(l);
            } catch (e: any) {
                if (e instanceof InsufficientFundsError && this.#failedPurchaseView === undefined) {
                    this.#failedPurchaseView = new failedPurchaseView(this);
                }
            }
        })
    }

    purchaseSecondhandTrap() {
        let secondhandPromise = CatShelter.getSecondhandTrap(this.#catShelter!);
        secondhandPromise.then(s => {
            try {
                this.#catShelter!.purchaseBuilding(s);
            } catch (e: any) {
                if (e instanceof InsufficientFundsError && this.#failedPurchaseView === undefined) {
                    this.#failedPurchaseView = new failedPurchaseView(this);
                }
            }
        })
    }

    // methods that mutate domain model
    purchaseAdderUpgrade(): void {
        let adderPromise = CatShelter.getAdderUpgrade(this.#catShelter!);
        adderPromise.then(a => {
            try {
                this.#catShelter!.purchaseUpgrade(a);
            } catch (error: any) {
                if (error instanceof InsufficientFundsError && this.#failedPurchaseView === undefined) {
                    this.#failedPurchaseView = new failedPurchaseView(this);
                }
            }
        })
    }

    purchaseMultiplierUpgrade(): void {
        let multPromise = CatShelter.getMultUpgrade(this.#catShelter!);
        multPromise.then(m => {
            try {
                this.#catShelter!.purchaseUpgrade(m);
            } catch (error: any) {
                if (error instanceof InsufficientFundsError && this.#failedPurchaseView === undefined) {
                    this.#failedPurchaseView = new failedPurchaseView(this);
                }
            }
        })
    }

    clickCat() {
        this.#catShelter!.clickCat();
    }

    showMultUpgradeDesc() {
        this.#upgradeView = new upgradeView(this, this.#invMult!.descriptor);    
    }

    showAddUpgradeDesc() {
        this.#upgradeView = new upgradeView(this, this.#invAdder!.descriptor);      
    }

    removeUpgradeDesc(): void {
        this.#upgradeView?.removeDialog();
    }

    resetFailPurchaseView() {
        this.#failedPurchaseView = undefined;
    }

}