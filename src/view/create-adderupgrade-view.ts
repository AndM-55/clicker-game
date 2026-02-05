import type CatShelterController from "../controller/catshelter-controller";
import { InvalidAddendException } from "../model/adderupgrade";
/**
 * this class creates and displays a dialogue when creating a
 * new Adder Upgrade for the cat shelter
 */
export default class CreateAdderUpgradeView {
    #controller: CatShelterController
    #dialog: HTMLDialogElement;

    constructor(controller: CatShelterController) {
        this.#controller = controller;

        //create the dialog and set its ID and innerHTML
        this.#dialog = document.createElement("dialog");
        this.#dialog.id = "add-adderupgrade-dialog";
        this.#dialog.innerHTML = /* html */`
            <label for="addend"> Add How Much? </label>
            <input type ="number" id="addend" />
            <button>Purchase Adder Upgrade</button>
        `
        // add some functionality to the dialogue button
        this.#dialog.querySelector("button")!.addEventListener('click', () => this.#purchaseAdderUpgrade())
        document.body.appendChild(this.#dialog);
        this.#dialog.show();
    }

    /**
     * this private function attempts to ask the controller to add an adder upgrade to the domain model
     * it catches improper input and indicates an error to the user 
     */
    #purchaseAdderUpgrade() {
        let addend = this.#dialog.querySelector("input")!.valueAsNumber;

        try {
            this.#controller.purchaseAdderUpgrade(addend);
            document.body.removeChild(this.#dialog);
        } catch (e: any) {
            if (e instanceof InvalidAddendException) {
                this.#dialog.querySelector("input")!.setAttribute("style", "border-color:red;");
            }
        }

    }
}