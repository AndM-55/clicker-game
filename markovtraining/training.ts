import fs from 'fs'

const ASCIIA = "a";
let denominator: number[] = Array(10).fill(0);
let numerator: number[][] = Array.from({length: 10}, () => Array(10).fill(0))

const rows = fs.readFileSync('training.csv', {
    encoding: 'utf-8'
}).split('\n')

rows.forEach((row: string) => {
    const tokens = row.split(',');
    for (let i = 0; i < tokens.length - 1; i++) {
        let init = (tokens[i].charCodeAt(0)) - (ASCIIA.charCodeAt(0));
        let end = (tokens[i+1].charCodeAt(0)) - (ASCIIA.charCodeAt(0));
        numerator[init][end]++;
        denominator[init]++
    }
})

let rawProbabilitiesString = "";

for (let i = 0; i < numerator.length; i++) {
    let currString = ""
    for (let j = 0; j < numerator[0].length; j++) {
        numerator[i][j] = numerator[i][j] / denominator[i]
        currString += numerator[i][j] 
        if (j != numerator[0].length - 1){
            currString += ","
        }
    }
    rawProbabilitiesString += currString + "\n"
}

const outputFilePath: string = 'output.csv';


fs.writeFile(outputFilePath, rawProbabilitiesString, 'utf8', () => {
  console.log(`numerator table written to ${outputFilePath} as csv.`);
});

