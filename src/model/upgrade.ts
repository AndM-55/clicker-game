import type CatShelter from "./catshelter";

//interface that all Upgrades must adhere to 
export default interface Upgrade {
    id?: number;
    mechanic: string
    name: string;
    shelter: CatShelter
    price: number
    descriptor: string

    
    applyEffect(base: number) : number;
    copy(u: Upgrade) : Upgrade
    get power() : number;
    
}