import type CatShelterController from "../controller/catshelter-controller";
import AdderUpgrade from "../model/adderupgrade";
import CatShelter from "../model/catshelter";
import LuxuriousTrap from "../model/luxurious-trap";
import MultiplierUpgrade from "../model/multiplierupgrade";
import SecondhandTrap from "../model/secondhand-trap";
/**
 * this class is responsible for displaying the entirety of the cat shelter to the user
 * including state, and the possible inputs it will take.
 */
export default class CatShelterView {
    #catShelter: CatShelter;
    #upgradesEl: HTMLUListElement;
    #buildingsEl: HTMLUListElement;
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
                <h1>Welcome, ${this.#catShelter.username}</h1>
                <button id="purchase-adder-upgrade">Purchase Adder Upgrade</button>
                <button id="purchase-multiplier-upgrade">Purchase Multiplier Upgrade</button>
                <button id="purchase-secondhand">Purchase Secondhand Trap</button>
                <button id="purchase-luxurious">Purchase Luxurious Trap</button>
                <button id="click-cat">Click To Adopt Cats!</button>
                <p>${this.#catShelter.cats + " cats"}</p>
                <ul></ul>
                <ul></ul>
            </div>`
        this.#upgradesEl = document.querySelector("#catShelter > ul")!
        this.#catsElement = document.querySelector("#catShelter > p")!
        this.#buildingsEl = document.querySelector("#catShelter > ul")!

        // display adder upgrade details upon mouseenter
        document.querySelector("#purchase-adder-upgrade")!
            .addEventListener("click",
                () => this.#controller.purchaseAdderUpgrade());

        document.querySelector("#purchase-adder-upgrade")!
            .addEventListener("mouseenter", 
                () => this.#controller.showAddUpgradeDesc());

        document.querySelector("#purchase-adder-upgrade")!
            .addEventListener("mouseleave", 
                () => this.#controller.removeItemDesc());
        // ---------------------------------------------------
        // display multiplier upgrade details upon mouseenter
        document.querySelector("#purchase-multiplier-upgrade")!
            .addEventListener("click",
                () => this.#controller.purchaseMultiplierUpgrade());

        document.querySelector("#purchase-multiplier-upgrade")!
            .addEventListener("mouseenter", 
                () => this.#controller.showMultUpgradeDesc());

        document.querySelector("#purchase-multiplier-upgrade")!
            .addEventListener("mouseleave", 
                () => this.#controller.removeItemDesc());
        //----------------------------------------------------
        // display luxurious trap details upon mouseenter
        document.querySelector("#purchase-luxurious")!
            .addEventListener("click", 
                () => this.#controller.purchaseLuxuriousTrap());

        document.querySelector("#purchase-luxurious")!
            .addEventListener("mouseenter", 
                () => this.#controller.showLuxurious());

        document.querySelector("#purchase-luxurious")!
            .addEventListener("mouseleave", 
                () => this.#controller.removeItemDesc());
        //----------------------------------------------------
        // display secondhand trap details upon mouseenter
        document.querySelector("#purchase-secondhand")!
            .addEventListener("click", 
                () => this.#controller.purchaseSecondhandTrap());

        document.querySelector("#purchase-secondhand")!
            .addEventListener("mouseenter", 
                () => this.#controller.showSecondhand());

        document.querySelector("#purchase-secondhand")!
            .addEventListener("mouseleave", 
                () => this.#controller.removeItemDesc());
        //----------------------------------------------------
            
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
        this.#buildingsEl.replaceChildren();

        //this block of code refreshes the view for displaying the number of cats
        let numCatsEl = document.createElement("num")
        numCatsEl.innerHTML = /* html */
            `<strong>${this.#catShelter.cats + " cats"}</strong>`
        this.#catsElement.appendChild(numCatsEl);


        // this block of code refreshes the view of all our list of upgrades
        // empty the entire list then repopulate it with the updated list of upgrades
        let upgradeLabel = document.createElement("li");
        upgradeLabel.innerHTML = /* html */`<strong>${"Your Upgrades"}</strong>`;
        this.#upgradesEl.appendChild(upgradeLabel);
        this.#catShelter.upgrades.forEach(upgrade => {
            let upgradeEl = document.createElement("li");
            if (upgrade instanceof AdderUpgrade) {
                upgradeEl.innerHTML = /* html */
                    `${"+" + upgrade.power}`;
            } else if (upgrade instanceof MultiplierUpgrade) {
                upgradeEl.innerHTML = /* html */
                    `${"x" + upgrade.power}`;
            }

            this.#upgradesEl.appendChild(upgradeEl);
        });

        // this block of code refreshes the view of all our list of buildings
        // empty the entire list then repopulate it with the updated list of buildings
        let buildingLabel = document.createElement("li");
        buildingLabel.innerHTML = /* html */`<strong>${"Your Buildings"}</strong>`;
        this.#buildingsEl.appendChild(buildingLabel);
        this.#catShelter.buildings.forEach(b => {
            let bEl = document.createElement("li");
            if (b instanceof LuxuriousTrap) {
                bEl.innerHTML = /* html */
                    `${b.efficiency + " per second"}`;
            } else if (b instanceof SecondhandTrap) {
                bEl.innerHTML = /* html */
                    `${b.efficiency + " per second"}`;
            }

            this.#upgradesEl.appendChild(bEl);
        })
    }
}