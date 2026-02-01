const fs = require('fs');
const content = fs.readFileSync('src/data/vulnerability-library.json', 'utf8');
const lines = content.split('\n');

let count = 0;
lines.forEach((line, index) => {
    if (line.includes('"id": "flashloan-flaw"')) {
        console.log(`Found at line ${index + 1}: ${line.trim()}`);
        count++;
    }
});

if (count === 0) console.log('No matches found for literal string.');
