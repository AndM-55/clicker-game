import CatShelterController from "../controller/catshelter-controller";

export default class upgradeView {
    #controller: CatShelterController;
    #dialog: HTMLDialogElement;

    constructor(controller: CatShelterController, msg: string) {
        this.#controller = controller;

        this.#dialog = document.createElement("dialog");
        this.#dialog.id = "upgrade-desc-dialog";
        this.#dialog.innerHTML = /*html */`
            <p>${msg}</p>
        `
        // add to the page:
        document.body.appendChild(this.#dialog)
        // dialogs are hidden by default, show yourself:
        this.#dialog.show();
    }

    removeDialog() {
        document.body.removeChild(this.#dialog);
    }
}