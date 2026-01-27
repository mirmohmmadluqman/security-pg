
import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

const SOURCE_DIR = 'Integrations_/DeFiVulnLabs-main/src/test';
const OUTPUT_FILE = 'src/data/vulnerability-library.json';

interface Vulnerability {
    id: string;
    slug: string;
    title: string;
    description: string;
    mitigation: string;
    code: string;
    source: {
        name: string;
        url: string;
        repo: string;
    };
    severity: string;
    standard: string;
    category: string;
}

async function generateLibrary() {
    console.log('🔍 Scanning for vulnerability files...');

    // Find all solidity files in the source directory
    const files = await glob(`${SOURCE_DIR}/**/*.sol`);

    console.log(`Found ${files.length} files. Parsing...`);

    const vulnerabilities: Vulnerability[] = [];

    for (const file of files) {
        try {
            const content = fs.readFileSync(file, 'utf-8');
            const filename = path.basename(file, '.sol');

            // Parse metadata from comments
            const nameMatch = content.match(/Name:\s*(.+)/i);
            const descriptionMatch = content.match(/Description:\s*([\s\S]*?)(?=Mitigation:|Code:|Contract:|Scenario:|Recommendation:|\*\/)/i);
            const mitigationMatch = content.match(/Mitigation:\s*([\s\S]*?)(?=\*\/)/i);

            // Clean up extracted text
            const cleanText = (text: string) => text
                .replace(/\*\s?/g, '') // Remove asterisks
                .trim();

            const title = nameMatch ? cleanText(nameMatch[1]) : filename;
            const description = descriptionMatch ? cleanText(descriptionMatch[1]) : 'No description provided.';
            const mitigation = mitigationMatch ? cleanText(mitigationMatch[1]) : 'No mitigation provided.';

            // Generate slug from filename (more stable than title)
            // Generate slug: handle camelCase/PascalCase -> kebab-case, then sanitize
            const slug = filename
                .replace(/([a-z])([A-Z])/g, '$1-$2') // Camel/Pascal to kebab (e.g. ApproveScam -> Approve-Scam)
                .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2') // Handle consecutive caps (e.g. HTMLParser -> HTML-Parser)
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphen
                .replace(/^-+|-+$/g, ''); // Trim leading/trailing hyphens

            // Extract Severity, Category, Standard (SWC)
            // Use simple heuristics or manual mapping if not present in file
            // Many files contain links to SWC registry which we can parse
            const swcMatch = content.match(/SWC-([0-9]+)/i);
            const standard = swcMatch ? `SWC-${swcMatch[1]}` : 'General';

            // Simple keyword matching for category
            let category = 'Uncategorized';
            const lowerContent = content.toLowerCase();
            if (lowerContent.includes('reentra')) category = 'Reentrancy';
            else if (lowerContent.includes('access')) category = 'Access Control';
            else if (lowerContent.includes('overflow')) category = 'Arithmetic';
            else if (lowerContent.includes('price') || lowerContent.includes('oracle')) category = 'Oracle';
            else if (lowerContent.includes('random')) category = 'Randomness';
            else if (lowerContent.includes('front-run') || lowerContent.includes('frontrun')) category = 'Front Running';
            else if (lowerContent.includes('dos') || lowerContent.includes('denial')) category = 'DoS';
            else if (lowerContent.includes('logic')) category = 'Logic Error';

            const vulnerability: Vulnerability = {
                id: slug,
                slug,
                title,
                description,
                mitigation,
                code: content,
                severity: 'Medium', // Default, could be refined
                category,
                standard,
                source: {
                    name: 'DeFi Vuln Labs',
                    url: `https://github.com/SunWeb3Sec/DeFiVulnLabs/blob/main/src/test/${path.basename(file)}`,
                    repo: 'https://github.com/SunWeb3Sec/DeFiVulnLabs'
                }
            };

            vulnerabilities.push(vulnerability);
        } catch (error) {
            console.error(`Error parsing ${file}:`, error);
        }
    }

    // Sort by title
    vulnerabilities.sort((a, b) => a.title.localeCompare(b.title));

    // Ensure output directory exists
    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write JSON file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(vulnerabilities, null, 2));

    console.log(`✅ Dictionary generated!`);
    console.log(`Saved ${vulnerabilities.length} vulnerabilities to ${OUTPUT_FILE}`);
}

generateLibrary();
