import type CatShelterController from "../controller/catshelter-controller";
import { InvalidAddendException } from "../model/adderupgrade";

export default class CreateAdderUpgradeView {
    #controller: CatShelterController
    #dialog: HTMLDialogElement;

    constructor(controller: CatShelterController) {
        this.#controller = controller;

        this.#dialog = document.createElement("dialog");
        this.#dialog.id = "add-adderupgrade-dialog";
        this.#dialog.innerHTML = /* html */`
            <label for="addend"> Add How Much? </label>
            <input type ="number" id="addend" />
            <button>Purchase Adder Upgrade</button>
        `

        this.#dialog.querySelector("button")!.addEventListener('click', () => this.#purchaseAdderUpgrade())
        document.body.appendChild(this.#dialog);
        this.#dialog.show(); 
    }   

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