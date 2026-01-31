import AdderUpgrade from "../model/adderupgrade.ts";
import CatShelter from "../model/catshelter.ts";
import CatShelterView from "../view/catshelter-view.ts";


export default class CatShelterController {
    #catShelter: CatShelter;
    #catShelterView: CatShelterView;

    constructor() {
        this.#catShelter = new CatShelter();
        this.#catShelterView = new CatShelterView(this.#catShelter);
    }

    purchaseAdderUpgrade() : void {
        let a = new AdderUpgrade(10);
        this.#catShelter.purchaseUpgrade(a);

        // console.log("Purchased Adder Upgrade for the shelter");
        // console.log(this.#catShelter);

    }
}