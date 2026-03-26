import { assert } from "../assertions";
import type CatShelter from "./catshelter";
import type Building from "./building";
import db from "./connection";
import SecondhandTrap from "./secondhand-trap";

/**
 * Luxurious cat trap building that passively collects cats for an account
 */
export default class LuxuriousTrap {
    id?: number;
    name: string;
    shelter: CatShelter;
    descriptor: string;
    price: number;
    efficiency: number

    #checkTrap() {
        assert(this.efficiency > 1, "Cats per Second must be greater than 1 for buildings")
        assert(this.price >= 1, "Price must be at least 1 for buildings");
    }

    constructor(shelter: CatShelter, price: number, cps: number, descriptor: string) {
        this.efficiency = cps;
        this.descriptor = descriptor;
        this.price = price;
        this.shelter = shelter;
        this.name = "Luxurious Trap"
        this.#checkTrap();
    }

    /**
     * this function persists a building to the database
     * 
     * @param building the instance of {@link Building} to be persisted 
     * @returns a promise of the building that was persisted
     */
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

    /**
     * this function retrieves all buildings from the database that belong to an instance of account/shelter
     * 
     * @param shelter the {@link CatShelter} we are retrieving the {@link Building} instances for
     * @returns a promise of an array of buildings from the database
     */
    static async getBuildingsForShelter(shelter: CatShelter): Promise<Array<Building>> {
        let results = await db().query<{
          id: number
          efficiency: number
          price: number
          descriptor: string
          buildingtype: string
          shelter: string
    
        }>("select * from building where shelter = $1",
          [shelter.username]);
    
        let allBuildings = new Array<Building>;
    
        results.rows.forEach(row => {
          let b;
          if (row.buildingtype === "luxurious") {
            b = new LuxuriousTrap(shelter, row.price, row.efficiency, row.descriptor);
          } else {
            b = new SecondhandTrap(shelter, row.price, row.efficiency, row.descriptor);
          }
          b.id = row.id;
          allBuildings.push(b)
        })
    
        return allBuildings;
    }

    /**
     * gets the number of cats to be added to the {@link CatShelter} instance
     * 
     * @returns the efficiency of the building, i.e., the number of cats that it will add in one second
     */
    harvestCats() : number {
        return this.efficiency;
    }

    /**
     * this function deep copies an instance of a building
     * 
     * @param b instance to be deep copied
     * @returns the deep copy 
     */
    copy(b: Building): LuxuriousTrap {
      return new LuxuriousTrap(b.shelter, b.price, b.efficiency, b.descriptor)
    }
}

export class InvalidCPSException extends Error {}