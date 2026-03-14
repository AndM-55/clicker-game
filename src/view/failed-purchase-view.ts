import CatShelterController from "../controller/catshelter-controller";

export default class failedPurchaseView {
    #controller: CatShelterController;
    #dialog: HTMLDialogElement;

    constructor(controller: CatShelterController) {
        this.#controller = controller;

        this.#dialog = document.createElement("dialog");
        this.#dialog.id = "upgrade-desc-dialog";
        this.#dialog.innerHTML = /*html */`
            <p>Insufficient cats for this transaction. Obtain more cats first</p>
            <button>Close</button>
        `
        this.#dialog.querySelector("button")!
            .addEventListener("click", () => {
                this.#controller.resetFailPurchaseView();
                document.body.removeChild(this.#dialog);
            })
        // add to the page:
        document.body.appendChild(this.#dialog)
        // dialogs are hidden by default, show yourself:
        this.#dialog.show();
    }
}