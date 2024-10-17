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

1. [Node.js](https://nodejs.org/en/) (version >= 20) or using node version manager [nvm](https://github.com/nvm-sh/nvm#intro) (recommended, installation guide for nvm [here](https://collabnix.com/how-to-install-and-configure-nvm-on-mac-os/)).

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

### Running Local

1. Modify a `devChainConfigs.ts` under `src/config/chain` by adding your own chain config

```ts
{
    tier: "lite",
    chainId: "localinitia",
    chain: "localinitia",
    registryChainName: "localinitia",
    prettyName: "Local Initia",
    lcd: "http://localhost:1317",
    rpc: "http://localhost:26657",
    wallets: ["initia"], // keplr, initia, compass, station
    features: {
      faucet: {
        enabled: false,
      },
      wasm: {
        enabled: false,
      },
      move: {
        enabled: true,
        moduleMaxFileSize: 1_048_576,
      },
      pool: {
        enabled: false,
      },
      publicProject: {
        enabled: false,
      },
      gov: {
        enabled: true,
        version: "v1",
        hideOpenProposal: true,
      },
      nft: {
        enabled: false,
      },
    },
    gas: {
      gasAdjustment: 1.5,
      maxGasLimit: 200_000_000,
    },
    extra: {
      layer: "1",
    },
    network_type: "testnet",
    logo_URIs: {
      png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/INIT.png",
      svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/INIT.svg",
    },
    fees: {
      fee_tokens: [
        {
          denom: "uinit",
          fixed_min_gas_price: 0.15,
          low_gas_price: 0.15,
          average_gas_price: 0.15,
          high_gas_price: 0.4,
        },
      ],
    },
    registry: {
      bech32_prefix: "init",
      slip44: 118,
      staking: {
        staking_tokens: [
          {
            denom: "uinit",
          },
        ],
      },
      assets: [
        {
          description: "The native token of Initia",
          denom_units: [
            {
              denom: "uinit",
              exponent: 0,
            },
            {
              denom: "INIT",
              exponent: 6,
            },
          ],
          base: "uinit",
          display: "INIT",
          name: "Initia Native Token",
          symbol: "INIT",
          images: [
            {
              png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/INIT.png",
              svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/INIT.svg",
            },
          ],
          logo_URIs: {
            png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/INIT.png",
            svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/INIT.svg",
          },
        },
      ],
    },
  }
```

2. Update your project environment variables by

- adding your development `chainId` into `NEXT_PUBLIC_SUPPORTED_CHAIN_IDS`
- (move only) setting another variable `NEXT_PUBLIC_INITIA_MOVE_DECODER`

```bash
NEXT_PUBLIC_SUPPORTED_CHAIN_IDS=initiation-2,<chainId>

# move only
NEXT_PUBLIC_INITIA_MOVE_DECODER=https://celatone-move-api-prod-jiod42ec2q-as.a.run.app
```
