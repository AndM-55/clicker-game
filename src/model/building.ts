import type CatShelter from "./catshelter";

//interface that all buildings must adhere to 
export default interface Building {
    id?: number;
    descriptor: string;
    shelter: CatShelter;
    efficiency: number;
    price: number;
    
    harvestCats() : number;
}