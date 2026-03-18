import CatShelterController from "../controller/catshelter-controller";

/**
 * a simple view class to display the details of an item to the user
 * i.e., the description and price of the item (upgrade or building) 
 */
export default class ItemView {
    #controller: CatShelterController;
    #dialog: HTMLDialogElement;

    constructor(controller: CatShelterController, msg: string, price: number) {
        this.#controller = controller;

        this.#dialog = document.createElement("dialog");
        this.#dialog.id = "upgrade-desc-dialog";
        this.#dialog.innerHTML = /*html */`
            <p>${msg}</p>
            <p>costs ${price} cats</p>
        `

        document.body.appendChild(this.#dialog)

        this.#dialog.show();
    }

    removeDialog() {
        document.body.removeChild(this.#dialog);
    }
}