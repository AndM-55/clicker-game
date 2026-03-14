import type CatShelter from "./catshelter";

//interface that all Upgrades must adhere to 
export default interface Upgrade {
    id?: number;
    shelter: CatShelter
    price: number
    descriptor: string

    
    applyEffect(base: number) : number;
    get power() : number;
    
}