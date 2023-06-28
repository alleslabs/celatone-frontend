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

1. [Node.js](https://nodejs.org/en/) (version >= 14) or nvm installed.
2. [`Yarn`](https://yarnpkg.com/) installed.

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
yarn
```

3. Create a local config

```
echo "NEXT_PUBLIC_SELECTED_CHAIN=osmosis" > .env.local
```

4. Finally, run the development server

```bash
yarn dev
```

The website will then be live on [http://localhost:3000](http://localhost:3000)
