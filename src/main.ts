import { CatShelterController } from "./controller/catshelter-controller";
import ddl from '../create-tables.sql?raw';
import db from './model/connection.ts'

// load the tables into the database 
db().exec(ddl);

interface TrainingData {
    numerator: number[][];
    denominator: number[];
}

let jsonData: TrainingData

async function getTrainingData() {

    const inputFilePath: string = 'output.json';

    try {
        let response = await fetch(inputFilePath);
        jsonData = await response.json();
        
    } catch (e: any) {
        console.log("unexpected error while getting training data in cat shelter instance")
    }
}

getTrainingData()

export default function td() {
    return jsonData
}

new CatShelterController();


