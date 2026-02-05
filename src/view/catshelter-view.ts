import type CatShelterController from "../controller/catshelter-controller";
import AdderUpgrade from "../model/adderupgrade";
import CatShelter from "../model/catshelter";
import MultiplierUpgrade from "../model/multiplierupgrade";
/**
 * this class is responsible for displaying the entirety of the cat shelter to the user
 * including state, and the possible inputs it will take.
 */
export default class CatShelterView {
    #catShelter: CatShelter;
    #upgradesEl: HTMLUListElement;
    #catsElement: HTMLParagraphElement;
    #controller: CatShelterController;

    constructor(catShelter: CatShelter, controller: CatShelterController) {
        this.#catShelter = catShelter;
        this.#catShelter.registerListener(this);
        this.#controller = controller;

        /**
         * add the visible state of the catshelter to the body of the webpage
         * 
         * It has 3 buttons, a constant display of the number of cats, and an unordered list of upgrades
         */
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

        /**
         * assign some functionality to the cat shelter view buttons
         */
        document.querySelector("#purchase-adder-upgrade")!
            .addEventListener("click",
                () => this.#controller.showCreateAdderUpgradeView());

        document.querySelector("#purchase-multiplier-upgrade")!
            .addEventListener("click",
                () => this.#controller.showCreateMultiplierUpgradeView());

        document.querySelector("#click-cat")!
            .addEventListener("click", () => this.#controller.clickCat());
    }



    /**
     * this function updates the view of the entire catshelter 
     * it is called by its corresponding domain model instance
     */
    notify() {

        this.#upgradesEl.replaceChildren(); //discard all current list elements
        this.#catsElement.replaceChildren(); //discard the current displayed number of cats

        //this block of code refreshes the view for displaying the number of cats
        let numCatsEl = document.createElement("num")
        numCatsEl.innerHTML = /* html */
            `<strong>${this.#catShelter.cats + " cats"}</strong>`
        this.#catsElement.appendChild(numCatsEl);


        // this block of code refreshes the view of all our list of upgrades
        // empty the entire list then repopulate it with the updated list of upgrades
        this.#catShelter.upgrades.forEach(upgrade => {
            let upgradeEl = document.createElement("li");
            if (upgrade instanceof AdderUpgrade) {
                upgradeEl.innerHTML = /* html */
                    `<strong>${"+" + upgrade.addend}</strong>`;
            } else if (upgrade instanceof MultiplierUpgrade) {
                upgradeEl.innerHTML = /* html */
                    `<strong>${"x" + upgrade.multiplier}</strong>`;
            }

            this.#upgradesEl.appendChild(upgradeEl);
        });
    }
}