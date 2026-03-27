import type CatShelter from "./catshelter";

//interface that all buildings must adhere to 
export default interface Building {
    id?: number;
    name: string;
    mechanic: string
    descriptor: string;
    shelter: CatShelter;
    efficiency: number;
    price: number;
    
    harvestCats() : number;
    copy(b: Building) : Building
}