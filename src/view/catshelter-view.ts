import CatShelter from "../model/catshelter";

export default class CatShelterView {
    #catShelter: CatShelter;
    #upgradesEl: HTMLUListElement;

    constructor(catShelter: CatShelter) {
        this.#catShelter = catShelter;
        this.#catShelter.registerListener(this);

        document.querySelector("#app")!.innerHTML = /* html */
            `<div id ='catShelter'><ul></ul></div>`
        this.#upgradesEl = document.querySelector("#catShelter > ul")!
    }

    notify() {
        // when im notified, i need to update the state of my display

        // empty the contnts of the list (remove all elements)
        this.#upgradesEl.replaceChildren();

        this.#catShelter.upgrades.forEach(u => {
            let upgradeEl = document.createElement("li");
            upgradeEl.innerHTML= /* html */`<strong>${"unspecified upgrade"}</strong>`;
            this.#upgradesEl.appendChild(upgradeEl);
        });
    }
}