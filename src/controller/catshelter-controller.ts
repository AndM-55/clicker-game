import AdderUpgrade from "../model/adderupgrade.ts";
import CatShelter from "../model/catshelter.ts";
import MultiplierUpgrade from "../model/multiplierupgrade.ts";
import CatShelterView from "../view/catshelter-view.ts";


/**
 * this class is the controller for the cat shelter. 
 * 
 * it takes inputs from view and makes changes to the model when asked
 */
export default class CatShelterController {
    #catShelter: CatShelter;
    #catShelterView: CatShelterView;

    constructor() {
        this.#catShelter = new CatShelter();
        this.#catShelterView = new CatShelterView(this.#catShelter, this);
    }

    // methods that mutate domain model
    purchaseAdderUpgrade() : void {
        let a = new AdderUpgrade(3);
        this.#catShelter.purchaseUpgrade(a);

    }

    purchaseMultiplierUpgrade() : void {
        let m = new MultiplierUpgrade(2);
        this.#catShelter.purchaseUpgrade(m);
    }

    clickCat() {
        this.#catShelter.clickCat();
    }

    
}