import { CatShelterController } from "../controller/catshelter-controller";

/**
 * a simple dialog for displaying to the user that they didnt have the funds to 
 * purchase an upgrade.
 */
export default class failedPurchaseView {
    #controller: CatShelterController;
    #dialog: HTMLDialogElement;

    constructor(controller: CatShelterController, message: string) {
        this.#controller = controller;

        this.#dialog = document.createElement("dialog");
        this.#dialog.id = "upgrade-desc-dialog";
        this.#dialog.innerHTML = /*html */`
            <p>${message}</p>
            <button>Close</button>
        `
        // a close button on the dialog. This forces the user to acknowledge the error
        this.#dialog.querySelector("button")!
            .addEventListener("click", () => {
                this.#controller.resetFailPurchaseView();
                document.body.removeChild(this.#dialog);
            })

        document.body.appendChild(this.#dialog)

        this.#dialog.show();
    }
}