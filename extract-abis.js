const fs = require('fs');
const path = require('path');

const contractsDir = path.join(__dirname, 'security-pg-core-contracts/out');
const destDir = path.join(__dirname, 'src/abi');

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

const contracts = [
    'ChallengeRegistry',
    'ChallengeValidator',
    'ProgressTracker'
];

contracts.forEach(contractName => {
    const sourcePath = path.join(contractsDir, `${contractName}.sol`, `${contractName}.json`);
    const destPath = path.join(destDir, `${contractName}.json`);

    try {
        if (fs.existsSync(sourcePath)) {
            const data = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
            if (data.abi) {
                fs.writeFileSync(destPath, JSON.stringify(data.abi, null, 2));
                console.log(`Extracted ABI for ${contractName}`);
            } else {
                console.error(`No ABI found in ${sourcePath}`);
            }
        } else {
            console.error(`Source file not found: ${sourcePath}`);
        }
    } catch (err) {
        console.error(`Error processing ${contractName}:`, err);
    }
});
