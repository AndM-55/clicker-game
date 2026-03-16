import type CatShelterController from "../controller/catshelter-controller";
import { IncorrectUsernameOrPasswordException, InvalidAccountNameException, InvalidPasswordException, UsernameTakenEcxeption } from "../model/catshelter";

export default class CreateOrLoginView {
    #controller: CatShelterController;
    #dialog: HTMLDialogElement;

    constructor(controller: CatShelterController) {
        this.#controller = controller;
        this.#dialog = document.createElement("dialog");
        this.#dialog.innerHTML = /*html*/`
            <h2>Create Your Cat Shelter, Or login</h2>
            <h3>Input a username and passowrd</h3>
            <span id="error"></span><br />
            <label for="acc-name">Account name</label>
            <input type="text" id="acc-name" />
            <label for="pass">Password</label>
            <input type="text" id="pass" />
            <button id="create-shelter">Create New Shelter</button>
            <button id="login">Login</button>
        `
        this.#dialog.querySelector("#create-shelter")!
            .addEventListener("click", () => this.#addShelter());
        this.#dialog.querySelector("#login")!
            .addEventListener("click", () => this.#login());

        document.body.appendChild(this.#dialog)
        this.#dialog.show();
    }

    async #login() {
        let name = this.#dialog.querySelector<HTMLInputElement>("#acc-name")!.value;
        let pass = this.#dialog.querySelector<HTMLInputElement>("#pass")!.value;
        try {
            await this.#controller.login(name, pass);

            this.#controller.startAutoClick();
            document.body.removeChild(this.#dialog);
        } catch (e: any) {
            if (e instanceof IncorrectUsernameOrPasswordException) {
                this.#dialog.querySelector("input[id='acc-name']")!
                    .setAttribute('style', 'border-color:red;');
                this.#dialog.querySelector("input[id='pass']")!
                    .setAttribute('style', 'border-color:red;');
                this.#dialog.querySelector("#error")!
                    .textContent = "The username or password did not match";
            } else {
                console.log("unexpected error: " + e);
            }
        }
    }

    async #addShelter() {
        let name = this.#dialog.querySelector<HTMLInputElement>("#acc-name")!.value;
        let pass = this.#dialog.querySelector<HTMLInputElement>("#pass")!.value;
        this.#dialog.querySelector("input[id='acc-name']")!
            .setAttribute('style', 'border-color:default;');
        this.#dialog.querySelector("input[id='pass']")!
            .setAttribute('style', 'border-color:default;');
        try {
            await this.#controller.addShelter(name, pass);

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
            } else if (e instanceof UsernameTakenEcxeption) {
                this.#dialog.querySelector("input[id='acc-name']")!
                    .setAttribute('style', 'border-color:red;');
                this.#dialog.querySelector("#error")!
                    .textContent = "That username is taken already. Try a different name.";
            } else {
                console.log("unexpected error: " + e);
            }
        }
    }
}