import type CatShelterController from "../controller/catshelter-controller";
import { InvalidAccountNameException, InvalidPasswordException } from "../model/catshelter";

export default class CreateShelterView {
    #controller: CatShelterController;
    #dialog: HTMLDialogElement;

    constructor(controller: CatShelterController) {
        this.#controller = controller;
        this.#dialog = document.createElement("dialog");
        this.#dialog.innerHTML = /*html*/`
            <h2>Create Your Cat Shelter</h2>
            <h3>Choose a username and passowrd</h3>
            <span id="error"></span><br />
            <label for="acc-name">Account name</label>
            <input type="text" id="acc-name" />
            <label for="pass">Password</label>
            <input type="text" id="pass" />
            <button>Create Shelter!</button>
        `
        this.#dialog.querySelector("button")!
            .addEventListener("click", () => this.#addShelter());

        document.body.appendChild(this.#dialog)
        this.#dialog.show();
    }

    #addShelter() {
        let name = this.#dialog.querySelector<HTMLInputElement>("#acc-name")!.value;
        let pass = this.#dialog.querySelector<HTMLInputElement>("#pass")!.value;
        try {
            this.#controller.addShelter(name, pass);
            this.#controller.startAutoClick();
            document.body.removeChild(this.#dialog);
        } catch (e: any) {
            if (e instanceof InvalidAccountNameException) {
                this.#dialog.querySelector("input[id='acc-name']")!
                    .setAttribute('style', 'border-color:red;');
                this.#dialog.querySelector("#error")!
                    .textContent = "Invalid account name, account names must have at least one letter (e.g., Andrew).";
            } else if (e instanceof InvalidPasswordException){
                this.#dialog.querySelector("input[id='pass']")!
                    .setAttribute('style', 'border-color:red;');
                this.#dialog.querySelector("#error")!
                    .textContent = "Invalid password, passwords must have at least one character (e.g., 1234).";
            } 
            //     // unexpected errors can be logged so that we can add them to the 
            //     // try catch or figure out what the problem was.
            //     console.log("unexpected error " + e);
            // }
        }
    }
}