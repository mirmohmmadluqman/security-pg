const fs = require('fs');
const path = require('path');

const filePath = 'src/data/vulnerability-library.json';
const content = fs.readFileSync(filePath, 'utf-8');
const data = JSON.parse(content);

const twitterLinks = new Set();
const twitterRegex = /https:\/\/twitter\.com\/[a-zA-Z0-9_]+\/status\/[0-9]+/g;

data.forEach(vuln => {
    const matches = (vuln.description + ' ' + vuln.mitigation + ' ' + vuln.code).match(twitterRegex);
    if (matches) {
        matches.forEach(link => twitterLinks.add(link));
    }
});

console.log(Array.from(twitterLinks).sort().join('\n'));
