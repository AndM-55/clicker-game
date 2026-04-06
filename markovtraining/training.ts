import fs from 'fs'

const ASCIIA = "a";
let denominator: number[] = []
let numerator: number[][] = []

for (let i = 0; i < 10; i++) {
    numerator[i] = [];
    denominator[i] = 0
    for (let j = 0; j < 10; j++) {
        numerator[i][j] = 0
    }
}

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

const outputFilePath: string = 'output.json';

const object = {
    numerator,
    denominator
};

fs.writeFile(outputFilePath, JSON.stringify(object, null, 2), 'utf8', () => {
  console.log(`numerator table written to ${outputFilePath} as JSON.`);
});

