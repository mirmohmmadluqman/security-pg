import React from 'react';

/**
 * StructuredData component to implement JSON-LD schemas for SEO and AI discoverability.
 * Includes WebSite, Organization, Course, and FAQPage schemas.
 */
export function StructuredData() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Security Playground",
    "url": "https://securitypg.vercel.app",
    "description": "Interactive platform for learning Ethereum smart contract security",
    "author": {
      "@type": "Person",
      "name": "Mir Mohmmad Luqman"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Security Playground",
    "url": "https://securitypg.vercel.app",
    "logo": "https://securitypg.vercel.app/logo.png",
    "sameAs": [
      "https://github.com/mirmohmmadluqman/security-pg"
    ]
  };

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Smart Contract Security Training",
    "description": "Learn to identify and fix vulnerabilities in Ethereum smart contracts",
    "provider": {
      "@type": "Organization",
      "name": "Security Playground"
    },
    "educationalLevel": "Intermediate",
    "about": ["Smart Contract Security", "Ethereum", "Solidity", "Blockchain Security"]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is Security Playground?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Security Playground is an interactive, browser-based platform for learning Ethereum smart contract security through hands-on exploitation and fixing of real vulnerabilities."
        }
      },
      {
        "@type": "Question",
        "name": "Who is this platform for?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "It is designed for developers, security researchers, and anyone interested in learning about blockchain security and smart contract auditing."
        }
      },
      {
        "@type": "Question",
        "name": "What technologies are used in Security Playground?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The platform is built with Next.js, TypeScript, and Monaco Editor, allowing users to write, compile, and test smart contracts directly in the browser."
        }
      },
      {
        "@type": "Question",
        "name": "Is it free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Security Playground is an open-source educational resource aimed at improving the security of the Ethereum ecosystem."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
