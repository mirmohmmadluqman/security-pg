# Security Playground

<div align="center">
  <img src="public/logo.png" alt="Security Playground Logo" width="200"/>
  <p>An interactive, browser-based platform for learning Ethereum smart contract security through hands-on exploitation and fixing of real vulnerabilities.</p>
</div>

![License](https://img.shields.io/badge/license-GPL--3.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.3.5-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

Let's make Web3 secure! Join [Discord](https://discord.gg/qMd7jwV7UG)

## Overview

Security Playground teaches developers about common smart contract vulnerabilities in a safe, sandboxed environment. Learn by exploiting vulnerable contracts, understanding attack vectors, and implementing fixes.

## Features

- Browser-based Monaco Editor with Solidity syntax highlighting
- In-browser EVM for compiling and deploying contracts
- 8 interactive security modules covering real-world vulnerabilities
- Step-by-step learning path from exploitation to remediation
- Dark/Light mode support

## Security Modules

- Reentrancy Attacks
- Access Control Misconfigurations
- Integer Overflow/Underflow
- Unchecked External Calls
- TX-Origin Authentication
- Denial of Service (DoS)
- Storage Collisions
- Front-Running

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/mirmohmadluqman/security-pg.git
cd security-pg
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

1. Select a security vulnerability module
2. Study the vulnerable smart contract code
3. Run the exploit to see the vulnerability in action
4. Fix the code to patch the vulnerability
5. Verify your fix by running the exploit again

## Tech Stack

- Next.js 15.3.5
- TypeScript
- Tailwind CSS
- Monaco Editor
- solc-js
- shadcn/ui

## License

GPL-3.0 License - see [LICENSE](LICENSE) file for details.

## Developer

**Mir Mohmmad Luqman**

Full-stack blockchain developer passionate about smart contract security and Web3 education.

- GitHub: [@mirmohmmadluqman](https://github.com/mirmohmmadluqman)
- Portfolio: [mirmohmmadluqman.github.io/portfolio](https://mirmohmmadluqman.github.io/portfolio/)
- Email: Available on GitHub profile

## Disclaimer

This tool is for educational purposes only. The vulnerable contracts shown are intentionally insecure and should never be deployed to production environments.
