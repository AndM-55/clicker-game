import type CatShelterController from "../controller/catshelter-controller";
import AdderUpgrade from "../model/adderupgrade";
import CatShelter from "../model/catshelter";
import MultiplierUpgrade from "../model/multiplierupgrade";

export default class CatShelterView {
    #catShelter: CatShelter;
    #upgradesEl: HTMLUListElement;
    #catsElement: HTMLParagraphElement;
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
                <p>${this.#catShelter.cats + " cats"}</p>
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

        this.#upgradesEl.replaceChildren(); //discard all current list elements
        this.#catsElement.replaceChildren(); //discard the current displayed number of cats

        //this block of code refreshes the view for displaying the number of cats
        let numCatsEl = document.createElement("num")
        numCatsEl.innerHTML = /* html */
            `<strong>${this.#catShelter.cats + " cats"}</strong>`
        this.#catsElement.appendChild(numCatsEl);


        // this block of code refreshes the view of all our upgrades
        this.#catShelter.upgrades.forEach(u => {
            let upgradeEl = document.createElement("li");
            if (u instanceof AdderUpgrade) {
                upgradeEl.innerHTML= /* html */
                `<strong>${"+" + u.addend}</strong>`;
            } else if (u instanceof MultiplierUpgrade) {
                upgradeEl.innerHTML= /* html */
                `<strong>${"x" + u.multiplier}</strong>`;
            }
            
            this.#upgradesEl.appendChild(upgradeEl);
        });
    }
}