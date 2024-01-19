# Celatone Frontend

An explorer for a [CosmWasm](https://cosmwasm.com/)-powered [Cosmos](http://cosmos.network/) ecosystem.

## Development

### Stack

The Celatone frontend uses the following technologies:

- Language: [TypeScript](https://www.typescriptlang.org/)
- Framework: [React](https://reactjs.org/) & [Next.js](https://nextjs.org/)
- Components: [Chakra UI](https://chakra-ui.com/)
- Deployment: [Vercel](https://vercel.com/)

### Prerequisites

1. [Node.js](https://nodejs.org/en/) (version >= 18) or using node version manager [nvm](https://github.com/nvm-sh/nvm#intro) (recommended, installation guide for nvm [here](https://collabnix.com/how-to-install-and-configure-nvm-on-mac-os/)).

### Develop

1. Clone the project either using the standard Git CLI or the GitHub [gh](https://github.com/cli/cli) CLI

```bash
# Git CLI
git clone https://github.com/alleslabs/celatone-frontend
```

```bash
# gh CLI
gh repo clone alleslabs/celatone-frontend
```

2. Install the dependencies

```bash
# Navigate to the cloned repository
cd celatone-frontend
# Install dependencies
pnpm i
```

3. Create a `.env.local` file in the root of the project and add the following environment variables

```bash
# The mnemonic of the wallet that will be used for estimate gas fees
NEXT_PUBLIC_DUMMY_MNEMONIC="your mnemonic here"
NEXT_PUBLIC_SUPPORTED_CHAIN_IDS=osmosis-1,osmo-test-5
NEXT_PUBLIC_CELATONE_API_OVERRIDE=http://localhost:8080
```

4. Finally, run the development server

```bash
pnpm dev
```

The website will then be live on [http://localhost:3000](http://localhost:3000)
