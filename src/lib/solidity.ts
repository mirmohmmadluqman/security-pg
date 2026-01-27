import lessonsData from '@/data/solidity-lessons.json';

export interface CodeFile {
    fileName: string;
    code: string;
}

export interface SolidityLesson {
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

export interface CategoryInfo {
    slug: string;
    name: string;
    count: number;
    description: string;
    icon: string;
}

const lessons = lessonsData as SolidityLesson[];

// Category metadata
const CATEGORY_META: Record<string, { description: string; icon: string }> = {
    basic: {
        description: 'Learn Solidity fundamentals from data types to advanced assembly',
        icon: '📘',
    },
    applications: {
        description: 'Build real-world smart contract applications',
        icon: '🏗️',
    },
    hacks: {
        description: 'Understand common vulnerabilities and attack vectors',
        icon: '🔓',
    },
    evm: {
        description: 'Deep dive into Ethereum Virtual Machine internals',
        icon: '⚙️',
    },
    tests: {
        description: 'Testing strategies for smart contracts',
        icon: '🧪',
    },
    foundry: {
        description: 'Master Foundry testing framework',
        icon: '🔨',
    },
    defi: {
        description: 'Decentralized finance protocols and patterns',
        icon: '💰',
    },
};

/**
 * Get all lessons
 */
export function getAllLessons(): SolidityLesson[] {
    return lessons;
}

/**
 * Get a lesson by its slug and category
 */
export function getLessonBySlug(categorySlug: string, slug: string): SolidityLesson | undefined {
    return lessons.find(l => l.categorySlug === categorySlug && l.slug === slug);
}

/**
 * Get all lessons in a category
 */
export function getLessonsByCategory(categorySlug: string): SolidityLesson[] {
    return lessons.filter(l => l.categorySlug === categorySlug).sort((a, b) => a.order - b.order);
}

/**
 * Get all unique categories with metadata
 */
export function getAllCategories(): CategoryInfo[] {
    const categoryMap = new Map<string, { name: string; count: number }>();

    for (const lesson of lessons) {
        if (!categoryMap.has(lesson.categorySlug)) {
            categoryMap.set(lesson.categorySlug, { name: lesson.category, count: 0 });
        }
        categoryMap.get(lesson.categorySlug)!.count++;
    }

    const categoryOrder = ['basic', 'applications', 'hacks', 'evm', 'tests', 'foundry', 'defi'];

    return categoryOrder
        .filter(slug => categoryMap.has(slug))
        .map(slug => {
            const info = categoryMap.get(slug)!;
            const meta = CATEGORY_META[slug] || { description: '', icon: '📄' };
            return {
                slug,
                name: info.name,
                count: info.count,
                description: meta.description,
                icon: meta.icon,
            };
        });
}

/**
 * Get prev/next lessons for navigation
 */
export function getPrevNextLessons(categorySlug: string, slug: string): {
    prev: SolidityLesson | null;
    next: SolidityLesson | null;
} {
    const categoryLessons = getLessonsByCategory(categorySlug);
    const currentIndex = categoryLessons.findIndex(l => l.slug === slug);

    return {
        prev: currentIndex > 0 ? categoryLessons[currentIndex - 1] : null,
        next: currentIndex < categoryLessons.length - 1 ? categoryLessons[currentIndex + 1] : null,
    };
}

/**
 * Generate Remix IDE URL for a code file
 */
export function getRemixUrl(code: string, fileName: string): string {
    const encoded = Buffer.from(code).toString('base64');
    return `https://remix.ethereum.org/#code=${encoded}&lang=en&optimize=false&runs=200&evmVersion=null&version=soljson-v0.8.26+commit.8a97fa7a.js`;
}

/**
 * Generate Remix Lite URL for a code file
 */
export function getRemixLiteUrl(code: string): string {
    const encoded = Buffer.from(code).toString('base64');
    return `https://remix.ethereum.org/#code=${encoded}&lite=1`;
}

/**
 * Search lessons by keyword
 */
export function searchLessons(query: string): SolidityLesson[] {
    const lowerQuery = query.toLowerCase();
    return lessons.filter(l =>
        l.title.toLowerCase().includes(lowerQuery) ||
        l.description.toLowerCase().includes(lowerQuery) ||
        l.keywords.some(k => k.toLowerCase().includes(lowerQuery))
    );
}
