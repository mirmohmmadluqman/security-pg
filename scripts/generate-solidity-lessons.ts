import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';

const SOURCE_DIR = path.join(__dirname, '..', 'Integrations_', 'Pending', 'solidity-by-example', 'src', 'pages');
const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'data', 'solidity-lessons.json');

// Category mapping based on path structure
const CATEGORY_MAP: Record<string, string> = {
    'app': 'applications',
    'hacks': 'hacks',
    'evm': 'evm',
    'tests': 'tests',
    'foundry': 'foundry',
    'defi': 'defi',
};

interface CodeFile {
    fileName: string;
    code: string;
}

interface SolidityLesson {
    slug: string;
    title: string;
    category: string;
    categorySlug: string;
    description: string;
    content: string;
    codes: CodeFile[];
    version: string;
    keywords: string[];
    order: number;
}

// Navigation order from original nav.ts
const BASIC_ORDER = [
    'hello-world', 'first-app', 'primitives', 'variables', 'constants', 'immutable',
    'state-variables', 'ether-units', 'gas', 'if-else', 'loop', 'mapping', 'array',
    'enum', 'user-defined-value-types', 'structs', 'data-locations', 'transient-storage',
    'function', 'view-and-pure-functions', 'error', 'function-modifier', 'events',
    'events-advanced', 'constructor', 'inheritance', 'shadowing-inherited-state-variables',
    'super', 'visibility', 'interface', 'payable', 'sending-ether', 'fallback', 'call',
    'delegatecall', 'function-selector', 'calling-contract', 'new-contract', 'try-catch',
    'import', 'library', 'abi-encode', 'abi-decode', 'hashing', 'signature', 'gas-golf',
    'bitwise', 'unchecked-math', 'assembly-variable', 'assembly-if', 'assembly-loop',
    'assembly-error', 'assembly-math'
];

const APP_ORDER = [
    'ether-wallet', 'multi-sig-wallet', 'merkle-tree', 'iterable-mapping', 'erc20',
    'erc721', 'erc1155', 'gasless-token-transfer', 'simple-bytecode-contract', 'create2',
    'minimal-proxy', 'upgradeable-proxy', 'deploy-any-contract', 'write-to-any-slot',
    'uni-directional-payment-channel', 'bi-directional-payment-channel', 'english-auction',
    'dutch-auction', 'crowd-fund', 'multi-call', 'multi-delegatecall', 'time-lock',
    'assembly-bin-exp', 'airdrop'
];

const HACK_ORDER = [
    're-entrancy', 'overflow', 'self-destruct', 'accessing-private-data', 'delegatecall',
    'randomness', 'denial-of-service', 'phishing-with-tx-origin',
    'hiding-malicious-code-with-external-contract', 'honeypot', 'front-running',
    'block-timestamp-manipulation', 'signature-replay', 'contract-size',
    'deploy-different-contracts-same-address', 'vault-inflation', 'weth-permit', '63-64-gas-rule'
];

const EVM_ORDER = ['storage', 'memory'];
const TEST_ORDER = ['echidna'];
const FOUNDRY_ORDER = ['basic', 'auth', 'error', 'event', 'send', 'time', 'sign', 'label', 'mock-call', 'vm-store'];

const DEFI_ORDER = [
    'uniswap-v2', 'uniswap-v2-add-remove-liquidity', 'uniswap-v2-optimal-one-sided-supply',
    'uniswap-v2-flash-swap', 'uniswap-v3-swap', 'uniswap-v3-liquidity', 'uniswap-v3-flash',
    'uniswap-v3-flash-swap', 'uniswap-v4-swap', 'uniswap-v4-flash', 'uniswap-v4-limit-order',
    'chainlink-price-oracle', 'chronicle-price-oracle', 'dai-proxy', 'staking-rewards',
    'discrete-staking-rewards', 'vault', 'token-lock', 'constant-sum-amm', 'constant-product-amm',
    'stable-swap-amm'
];

function getOrder(slug: string, category: string): number {
    switch (category) {
        case 'basic': return BASIC_ORDER.indexOf(slug);
        case 'applications': return APP_ORDER.indexOf(slug);
        case 'hacks': return HACK_ORDER.indexOf(slug);
        case 'evm': return EVM_ORDER.indexOf(slug);
        case 'tests': return TEST_ORDER.indexOf(slug);
        case 'foundry': return FOUNDRY_ORDER.indexOf(slug);
        case 'defi': return DEFI_ORDER.indexOf(slug);
        default: return 999;
    }
}

function getCategoryLabel(categorySlug: string): string {
    const labels: Record<string, string> = {
        'basic': 'Basic',
        'applications': 'Applications',
        'hacks': 'Hacks',
        'evm': 'EVM',
        'tests': 'Tests',
        'foundry': 'Foundry',
        'defi': 'DeFi',
    };
    return labels[categorySlug] || categorySlug;
}

// Recursive function to find all directories containing index.md
function findLessonDirs(dir: string, results: string[] = []): string[] {
    try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        // Check if this directory has index.md
        const hasIndexMd = entries.some(e => e.isFile() && e.name === 'index.md');
        if (hasIndexMd) {
            results.push(dir);
        }

        // Recurse into subdirectories
        for (const entry of entries) {
            if (entry.isDirectory()) {
                findLessonDirs(path.join(dir, entry.name), results);
            }
        }
    } catch (e) {
        console.error(`Error reading ${dir}:`, e);
    }
    return results;
}

// Find all .sol files in a directory
function findSolFiles(dir: string): string[] {
    try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        return entries
            .filter(e => e.isFile() && e.name.endsWith('.sol'))
            .map(e => path.join(dir, e.name));
    } catch (e) {
        return [];
    }
}

function generateSolidityLessons() {
    console.log('🔍 Scanning for Solidity lessons...');
    console.log(`Source directory: ${SOURCE_DIR}`);

    // Find all lesson directories
    const lessonDirs = findLessonDirs(SOURCE_DIR);
    console.log(`Found ${lessonDirs.length} lesson directories. Parsing...`);

    const lessons: SolidityLesson[] = [];

    for (const dir of lessonDirs) {
        try {
            const relativePath = path.relative(SOURCE_DIR, dir).replace(/\\/g, '/');

            // Skip root index
            if (relativePath === '' || relativePath === '.') continue;

            // Determine category and slug
            let category = 'Basic';
            let categorySlug = 'basic';
            let slug = relativePath;

            const pathParts = relativePath.split('/');
            if (pathParts.length > 1) {
                const firstPart = pathParts[0];
                if (CATEGORY_MAP[firstPart]) {
                    categorySlug = CATEGORY_MAP[firstPart];
                    category = getCategoryLabel(categorySlug);
                    slug = pathParts.slice(1).join('/');
                }
            }

            // Read markdown file
            const mdFile = path.join(dir, 'index.md');
            const mdContent = fs.readFileSync(mdFile, 'utf-8');
            const { data: frontmatter, content } = matter(mdContent);

            // Find all .sol files in the directory
            const solFiles = findSolFiles(dir);
            const codes: CodeFile[] = [];

            for (const solFile of solFiles) {
                const fileName = path.basename(solFile);
                const code = fs.readFileSync(solFile, 'utf-8');
                codes.push({ fileName, code });
            }

            console.log(`  ${slug}: found ${codes.length} .sol files`);

            // Process content - replace {{{FileName}}} with actual code
            let processedContent = content;
            for (const codeFile of codes) {
                const baseName = codeFile.fileName.replace('.sol', '');
                const placeholder = new RegExp(`\\{\\{\\{${baseName}\\}\\}\\}`, 'g');
                processedContent = processedContent.replace(placeholder, codeFile.code);
            }

            const lesson: SolidityLesson = {
                slug,
                title: frontmatter.title || slug,
                category,
                categorySlug,
                description: frontmatter.description || '',
                content: processedContent.trim(),
                codes,
                version: frontmatter.version || '0.8.26',
                keywords: frontmatter.keywords || [],
                order: getOrder(slug, categorySlug),
            };

            lessons.push(lesson);
        } catch (error) {
            console.error(`Error parsing ${dir}:`, error);
        }
    }

    // Sort lessons by category then order
    lessons.sort((a, b) => {
        const catOrder = ['basic', 'applications', 'hacks', 'evm', 'tests', 'foundry', 'defi'];
        const catDiff = catOrder.indexOf(a.categorySlug) - catOrder.indexOf(b.categorySlug);
        if (catDiff !== 0) return catDiff;
        return a.order - b.order;
    });

    // Ensure output directory exists
    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write JSON file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(lessons, null, 2));

    console.log(`✅ Solidity lessons generated!`);
    console.log(`Saved ${lessons.length} lessons to ${OUTPUT_FILE}`);

    // Print category breakdown
    const categories = lessons.reduce((acc, l) => {
        acc[l.categorySlug] = (acc[l.categorySlug] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    console.log('Category breakdown:', categories);

    // Check codes
    const withCodes = lessons.filter(l => l.codes.length > 0).length;
    console.log(`Lessons with code files: ${withCodes}/${lessons.length}`);
}

generateSolidityLessons();
