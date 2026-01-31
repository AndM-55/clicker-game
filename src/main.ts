import CatShelterController from "./controller/catshelter-controller";

let catShelterController = new CatShelterController();


document.querySelector("#purchase-adder-upgrade")!
    .addEventListener("click", 
        () => catShelterController.purchaseAdderUpgrade())