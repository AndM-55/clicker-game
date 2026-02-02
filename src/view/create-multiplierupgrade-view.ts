import CatShelterController from "../controller/catshelter-controller";
import { InvalidMultiplierExeption } from "../model/multiplierupgrade";

export default class CreateMultiplierUpgradeView {

    #controller: CatShelterController
    #dialog: HTMLDialogElement;

    constructor(controller: CatShelterController) {
        this.#controller = controller;

        this.#dialog = document.createElement("dialog");
        this.#dialog.id = "add-multiplierupgrade-dialog";
        this.#dialog.innerHTML = /* html */`
                <label for="multiplier"> Multiply How Much? </label>
                <input type ="number" id="multiplier" />
                <button>Purchase Multiplier Upgrade</button>
            `

        this.#dialog.querySelector("button")!.addEventListener('click', () => this.#purchaseMultiplierUpgrade())
        document.body.appendChild(this.#dialog);
        this.#dialog.show();
    }

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