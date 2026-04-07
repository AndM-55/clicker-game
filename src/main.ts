import { CatShelterController } from "./controller/catshelter-controller";
import ddl from '../create-tables.sql?raw';
import csvString from '../output.csv?raw';
import db from './model/connection.ts'
import seedrandom from "seedrandom";

// load the tables into the database 
db().exec(ddl);

const rows = csvString.split("\n")

const matrix: number[][] = Array.from({ length: 10 }, () => Array(10).fill(0))

let currRow = 0
rows.forEach((row) => {
    let tokens = row.split(",")
    if (tokens.length > 1) {

        for (let currCol = 0; currCol < matrix.length; currCol++) {
            let probability = tokens[currCol]
            matrix[currRow][currCol] = parseFloat(probability);
        }
        currRow++
    }

})

export default function td() {
    return matrix
}


/**
 * an instance of seedrandom, and a method to get it's next random number
 */
const rand = seedrandom("click")

export function rng(): number {
    return rand();
}
// -------------------------------------


new CatShelterController();


