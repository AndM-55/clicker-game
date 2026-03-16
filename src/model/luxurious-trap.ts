import { assert } from "../assertions";
import type CatShelter from "./catshelter";
import type Building from "./building";
import db from "./connection";
import SecondhandTrap from "./secondhand-trap";


export default class LuxuriousTrap {
    id?: number;
    shelter: CatShelter;
    descriptor: string;
    price: number;
    efficiency: number

    constructor(shelter: CatShelter, price: number, cps: number, descriptor: string) {
        this.efficiency = cps;
        this.descriptor = descriptor;
        this.price = price;
        this.shelter = shelter;
        this.#checkTrap();
    }

    static async saveBuilding(building: Building): Promise<Building> {
        let type 
        if (building instanceof LuxuriousTrap) {
          type = "luxurious";
        } else {
          type = "secondhand";
        }
    
        let results = await db().query<{ id: number }>("insert into building(id, efficiency, price, descriptor, buildingtype, shelter) values(default, $1, $2, $3, $4, $5) returning id",
          [building.efficiency, building.price, building.descriptor, type, building.shelter.username]);
    
        let row = results.rows[0];
        building.id = row.id;
        console.log(`building got id ${building.id}`);
        return building;
    }

    static async getBuildingsForShelter(shelter: CatShelter): Promise<Array<Building>> {
        let results = await db().query<{
          id: number
          efficiency: number
          price: number
          descriptor: string
          buildingtype: string
          shelter: string
    
        }>("select id, efficiency, price, descriptor, buildingtype, shelter from building where shelter = $1",
          [shelter.username]);
    
        let allBuildings = new Array<Building>;
    
        results.rows.forEach(row => {
          let b;
          if (row.buildingtype === "luxurious") {
            b = new LuxuriousTrap(shelter, row.price, row.efficiency, row.descriptor);
          } else {
            b = new SecondhandTrap(shelter, row.price, row.efficiency);
          }
          b.id = row.id;
          allBuildings.push(b)
        })
    
        return allBuildings;
    }

    #checkTrap() {
        assert(this.efficiency > 1, "Cats per Second must be greater than 1 for buildings")
        assert(this.price >= 1, "Price must be at least 1 for buildings");
    }

    harvestCats() : number {
        return this.efficiency;
    }
}

export class InvalidCPSException extends Error {}