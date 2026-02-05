import AdderUpgrade from "../model/adderupgrade.ts";
import CatShelter from "../model/catshelter.ts";
import MultiplierUpgrade from "../model/multiplierupgrade.ts";
import CatShelterView from "../view/catshelter-view.ts";
import CreateAdderUpgradeView from "../view/create-adderupgrade-view.ts";
import CreateMultiplierUpgradeView from "../view/create-multiplierupgrade-view.ts";

/**
 * this class is the controller for the cat shelter. 
 * 
 * it takes inputs from view and makes changes to the model when asked
 */
export default class CatShelterController {
    #catShelter: CatShelter;
    #catShelterView: CatShelterView;
    #createAddUpgradeView?: CreateAdderUpgradeView;
    #createMultUpgradeView?: CreateMultiplierUpgradeView;

    constructor() {
        this.#catShelter = new CatShelter();
        this.#catShelterView = new CatShelterView(this.#catShelter, this);
    }

    // methods that mutate domain model
    purchaseAdderUpgrade(addend: number) : void {
        let a = new AdderUpgrade(addend);
        this.#catShelter.purchaseUpgrade(a);

    }

    purchaseMultiplierUpgrade(multiplier: number) : void {
        let m = new MultiplierUpgrade(multiplier);
        this.#catShelter.purchaseUpgrade(m);
    }

    clickCat() {
        this.#catShelter.clickCat();
    }

    // methods that create additional views
    showCreateAdderUpgradeView() {
        this.#createAddUpgradeView = new CreateAdderUpgradeView(this);
    }

    showCreateMultiplierUpgradeView() {
        this.#createMultUpgradeView = new CreateMultiplierUpgradeView(this);
    }
}