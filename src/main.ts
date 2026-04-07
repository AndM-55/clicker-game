import { CatShelterController } from "./controller/catshelter-controller";
import ddl from '../create-tables.sql?raw';
import csvString from '../output.csv?raw';
import db from './model/connection.ts'
import seedrandom from "seedrandom";

// load the tables into the database 
db().exec(ddl);

const rows = csvString.split("\n")

// initialize a matrix and fill it with the raw probabilities for all transitions
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

// function to give the domain model access to the matrix
export default function td() {
    return matrix
}


/**
 * an instance of seedrandom, and a method to let the domain model access the seedrandom
 */
const rand = seedrandom("click")

export function rng(): number {
    return rand();
}
// -------------------------------------


new CatShelterController();


