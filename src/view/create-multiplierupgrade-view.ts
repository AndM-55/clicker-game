import CatShelterController from "../controller/catshelter-controller";
import { InvalidMultiplierExeption } from "../model/multiplierupgrade";

/**
 * this class creates and displays a dialogue when creating a
 * new multiplier Upgrade for the cat shelter
 */
export default class CreateMultiplierUpgradeView {

    #controller: CatShelterController
    #dialog: HTMLDialogElement;

    constructor(controller: CatShelterController) {
        this.#controller = controller;

        //create the dialog and set its ID and innerHTML
        this.#dialog = document.createElement("dialog");
        this.#dialog.id = "add-multiplierupgrade-dialog";
        this.#dialog.innerHTML = /* html */`
                <label for="multiplier"> Multiply How Much? </label>
                <input type ="number" id="multiplier" />
                <button>Purchase Multiplier Upgrade</button>
            `

        // add functionality to the dialog button
        this.#dialog.querySelector("button")!.addEventListener('click', () => this.#purchaseMultiplierUpgrade())
        document.body.appendChild(this.#dialog);
        this.#dialog.show();
    }

    /**
     * this private function attempts to ask the controller to add a multiplier upgrade to the domain model
     * it catches improper input and indicates an error to the user 
     */
    #purchaseMultiplierUpgrade() {
        let mult = this.#dialog.querySelector("input")!.valueAsNumber;

        try {
            this.#controller.purchaseMultiplierUpgrade(mult);
            document.body.removeChild(this.#dialog);
        } catch (e: any) {
            if (e instanceof InvalidMultiplierExeption) {
                this.#dialog.querySelector("input")!.setAttribute("style", "border-color:red;");
            }
        }

    }
}