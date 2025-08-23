# Scan Frontend

Scan is a blockchain explorer service that provides comprehensive transaction and contract analysis for CosmWasm-powered Cosmos ecosystems so that users can efficiently explore, debug, and monitor their blockchain interactions.

A powerful web-based explorer designed for developers and users working with CosmWasm smart contracts and Cosmos blockchain networks, offering detailed transaction analysis, contract interaction tools, and network monitoring capabilities.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Running Locally](#running-locally)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [License](#license)

## Installation

```sh
git clone https://github.com/alleslabs/celatone-frontend.git
cd celatone-frontend
pnpm install
```

## Configuration

Copy `.env` and fill values:

```sh
cp .env.example .env.local
```

```env
# The mnemonic of the wallet that will be used for estimate gas fees
NEXT_PUBLIC_DUMMY_MNEMONIC="your mnemonic here"
NEXT_PUBLIC_SUPPORTED_NETWORK_TYPES=local,devnet,testnet,mainnet
NEXT_PUBLIC_CHAIN=<chain-name>
NEXT_PUBLIC_INITIA_API=http://localhost:8080
NEXT_PUBLIC_CELATONE_API=http://localhost:8081
```

For local development, modify `devChainConfigs.ts` under `src/config/chain` by adding your own chain configuration with the appropriate network settings, RPC endpoints, and feature flags.

## Running Locally

```sh
pnpm dev
```

The server will start on `http://localhost:3000`

## Tech Stack

- Framework: [React](https://reactjs.org/) & [Next.js](https://nextjs.org/)
- Language: [TypeScript](https://www.typescriptlang.org/)
- Components: [Chakra UI](https://chakra-ui.com/)
- State Management: [MobX](https://mobx.js.org/) & [TanStack Query](https://tanstack.com/query)
- HTTP Client: [Axios](https://axios-http.com/)
- Blockchain: [CosmJS](https://github.com/cosmos/cosmjs) & [Initia.js](https://github.com/initia-labs/initia.js)
- Wallet Integration: [Cosmos Kit](https://cosmoskit.com/) & [Initia Wallet](https://github.com/initia-labs/wallet)
- Deployment: [Vercel](https://vercel.com/)

## Project Structure

```
celatone-frontend/
├── src/
│   ├── components/        # Reusable React components
│   ├── config/            # Configuration files and chain configs
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # External library configurations
│   ├── pages/             # Next.js pages and routing
│   ├── stores/            # MobX state management
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions and helpers
│   └── styles/            # Global styles and themes
├── public/                # Static assets
├── .env                   # Environment variables template
├── next.config.js         # Next.js configuration
├── package.json
└── tsconfig.json          # TypeScript configuration
```

## Scripts

```sh
pnpm build          # Build production bundle
pnpm dev            # Start development server
pnpm start          # Start production server
pnpm test           # Run test suite
pnpm type-check     # Run TypeScript type checking
pnpm lint           # Run ESLint
pnpm lint:fix       # Fix ESLint issues and format code
pnpm format         # Format code with Prettier
pnpm storybook      # Start Storybook development server
pnpm build-storybook # Build Storybook for production
```

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.
