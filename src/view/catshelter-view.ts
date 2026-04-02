import type { CatShelterController } from "../controller/catshelter-controller";
import AdderUpgrade from "../model/adderupgrade";
import type Building from "../model/building";
import type Upgrade from "../model/upgrade";
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
    #buildingsInv: Array<Building>
    #upgradesInv: Array<Upgrade>
    #upgradesEl: HTMLUListElement;
    #buildingsEl: HTMLUListElement;
    #catsElement: HTMLParagraphElement;
    #controller: CatShelterController;
    #descriptionDialog?: HTMLDialogElement;
    #autoBuyActive: boolean;
    #autoBuyIntervalId?: number;

    constructor(catShelter: CatShelter, controller: CatShelterController, upgradesInv: Array<Upgrade>, buildingsInv: Array<Building>) {
        this.#catShelter = catShelter;
        this.#catShelter.registerListener(this);
        this.#controller = controller;
        this.#buildingsInv = buildingsInv;
        this.#upgradesInv = upgradesInv;
        this.#autoBuyActive = false;
        this.startAutoClick();

        /**
         * add the visible state of the catshelter to the body of the webpage
         * 
         * It has 5 buttons, one for each purchasable thing and one for the click to increase count
         */
        document.querySelector("#app")!.innerHTML = /* html */
            `<div id ='catShelter'>
                <h1>Welcome, ${this.#catShelter.username}</h1>
                <ul id=purchase-buttons></ul>
                <button id="click-cat">Click To Adopt Cats!</button>
                <button id="auto-buy">Toggle Auto Buy</button>
                <p>${this.#catShelter.cats + " cats"}</p>
                <h3>Your Upgrades</h3>
                <ul id="upgrade-list"></ul>
                <h3>Your Buildings</h3>
                <ul id="building-list"></ul>
            </div>`
        this.#upgradesEl = document.querySelector("#upgrade-list")!
        this.#catsElement = document.querySelector("#catShelter > p")!
        this.#buildingsEl = document.querySelector("#building-list")!

        const buttonList = document.querySelector("#purchase-buttons")! as HTMLUListElement
        buttonList.style.listStyleType = "none";
        buttonList.style.padding = "0";

        // create the upgrade buttons 
        for (let upgrade of this.#upgradesInv) {
            let li = document.createElement("li");
            let button = document.createElement("button")

            button.id = upgrade.descriptor
            button.textContent = `Purchase ${upgrade.name}`

            li.appendChild(button)
            buttonList.appendChild(li);

            button.addEventListener('click', () => {
                this.#controller.purchaseUpgrade(upgrade)
            })
            button.addEventListener('mouseenter', () => {
                this.#descriptionDialog = document.createElement("dialog");
                this.#descriptionDialog.id = "upgrade-desc-dialog";
                this.#descriptionDialog.innerHTML = /*html */`
                    <p>${upgrade.descriptor}</p>
                    <p>costs ${upgrade.price} cats</p>
                 `
                document.body.appendChild(this.#descriptionDialog)
                this.#descriptionDialog.show();
            })
            button.addEventListener('mouseleave', () => {
                this.removeDialog();
            })
        }

        //create the buildings buttons 
        for (let building of this.#buildingsInv) {
            let li = document.createElement("li");
            let button = document.createElement("button")

            button.id = building.descriptor
            button.textContent = `Purchase ${building.name}`

            li.appendChild(button)
            buttonList.appendChild(li);

            button.addEventListener('click', () => {
                this.#controller.purchaseBuilding(building)
            })
            button.addEventListener('mouseenter', () => {
                this.#descriptionDialog = document.createElement("dialog");
                this.#descriptionDialog.id = "upgrade-desc-dialog";
                this.#descriptionDialog.innerHTML = /*html */`
                    <p>${building.descriptor}</p>
                    <p>costs ${building.price} cats</p>
                 `
                document.body.appendChild(this.#descriptionDialog)
                this.#descriptionDialog.show();
            })
            button.addEventListener('mouseleave', () => {
                this.removeDialog();
            })
        }

        // create the click-cat button 
        document.querySelector("#click-cat")!
            .addEventListener("click", () => this.#controller.clickCat());

        document.querySelector("#auto-buy")!
            .addEventListener("click", () => {
                this.toggelAutoBuy();
            })
    }

    // this method removes any purchasable's description popup from the view
    removeDialog() {
        document.body.removeChild(this.#descriptionDialog!);
    }

    /**
     * this method begins the building auto clicking process for an instance of CatShelter
     */
    startAutoClick() {
        setInterval(() => {
            this.#controller!.autoClick();
        }, 1000);
    }

    toggelAutoBuy() {
        if (!this.#autoBuyActive) {
            this.#autoBuyIntervalId = setInterval(() => {
                this.#controller.autoBuy();
            }, 3000)
            this.#autoBuyActive = true;
        } else {
            clearInterval(this.#autoBuyIntervalId)
            this.#autoBuyActive = false;
        }
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
        this.#catShelter.buildings.forEach(b => {
            let bEl = document.createElement("li");
            if (b instanceof LuxuriousTrap) {
                bEl.innerHTML = /* html */
                    `${b.efficiency + " per second"}`;
            } else if (b instanceof SecondhandTrap) {
                bEl.innerHTML = /* html */
                    `${b.efficiency + " per second"}`;
            }

            this.#buildingsEl.appendChild(bEl);
        })
    }
}