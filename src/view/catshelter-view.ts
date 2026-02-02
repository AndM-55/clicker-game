import type CatShelterController from "../controller/catshelter-controller";
import CatShelter from "../model/catshelter";

export default class CatShelterView {
    #catShelter: CatShelter;
    #upgradesEl: HTMLUListElement;
    #catsElement: HTMLUnknownElement;
    #controller: CatShelterController;

    constructor(catShelter: CatShelter, controller: CatShelterController) {
        this.#catShelter = catShelter;
        this.#catShelter.registerListener(this);
        this.#controller = controller;

        document.querySelector("#app")!.innerHTML = /* html */
            `<div id ='catShelter'>
                <button id="purchase-adder-upgrade">Purchase Adder Upgrade</button>
                <button id="purchase-multiplier-upgrade">Purchase Multiplier Upgrade</button>
                <button id="click-cat">Click To Adopt Cats!</button>
                <p>${this.#catShelter.cats}</p>
                <ul></ul>
            </div>`
        this.#upgradesEl = document.querySelector("#catShelter > ul")!
        this.#catsElement = document.querySelector("#catShelter > p")!

        document.querySelector("#purchase-adder-upgrade")!
            .addEventListener("click", 
            () => this.#controller.showCreateAdderUpgradeView());

        document.querySelector("#purchase-multiplier-upgrade")!
            .addEventListener("click", 
            () => this.#controller.showCreateMultiplierUpgradeView());
        document.querySelector("#click-cat")!
            .addEventListener("click", () => this.#controller.clickCat());
    }

    

    notify() {
        // when im notified, i need to update the state of my display

        // empty the contnts of the list (remove all elements)
        this.#upgradesEl.replaceChildren();
        this.#catsElement.replaceChildren();

        let numCatsEl = document.createElement("num")
        numCatsEl.innerHTML = /* html */
            `<strong>${this.#catShelter.cats}</strong>`
        this.#catsElement.appendChild(numCatsEl);

        this.#catShelter.upgrades.forEach(u => {
            let upgradeEl = document.createElement("li");
            upgradeEl.innerHTML= /* html */
                `<strong>${u.getDescription()}</strong>`;
            this.#upgradesEl.appendChild(upgradeEl);
        });
    }
}