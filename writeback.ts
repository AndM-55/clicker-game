import fs from 'fs';

interface TrainingData {
    numerator: number[][];
    denominator: number[];
}

const inputFilePath: string = 'output.json';

const rawData = fs.readFileSync(inputFilePath, 'utf8');

const loadedData: TrainingData = JSON.parse(rawData);

const myNumerator: number[][] = loadedData.numerator;
const myDenominator: number[] = loadedData.denominator;

console.log(myNumerator[0][0]); 