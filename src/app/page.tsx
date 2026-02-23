import { Metadata } from 'next'
import HomeClient from './HomeClient'

export const metadata: Metadata = {
    title: 'Security Playground - Learn Smart Contract Security',
    description: 'Interactive browser-based platform for learning Ethereum smart contract security through hands-on exploitation and fixing of real vulnerabilities.',
    openGraph: {
        title: 'Security Playground - Smart Contract Security Training',
        description: 'Learn Ethereum security by exploiting and fixing real smart contract vulnerabilities',
        url: 'https://securitypg.vercel.app',
        siteName: 'Security Playground',
        type: 'website',
        images: [
            {
                url: '/logo.png',
                width: 800,
                height: 600,
                alt: 'Security Playground',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Security Playground - Smart Contract Security',
        description: 'Interactive platform for learning blockchain security vulnerabilities',
        images: ['/logo.png'],
    },
}

export default function Home() {
    return <HomeClient />
}
