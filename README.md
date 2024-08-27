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
  chain: "localosmosis",
  registryChainName: "localosmosis",
  prettyName: "Local Osmosis",
  lcd: "https://lcd.osmotest5.osmosis.zone",
  rpc: "https://osmosis-testnet-rpc.polkachu.com:443",
  wallets: ["keplr"], // keplr, initia, compass, station
  features: {
    faucet: {
      enabled: false,
    },
    wasm: {
      enabled: true,
      storeCodeMaxFileSize: 800_000,
      clearAdminGas: 50_000,
    },
    move: {
      enabled: false,
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
    maxGasLimit: 25_000_000,
  },
  extra: {},
  network_type: "testnet",
  logo_URIs: {
    png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmo.png",
    svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmo.svg",
  },
  fees: {
    fee_tokens: [
      {
        denom: "uosmo",
        fixed_min_gas_price: 0.0025,
        low_gas_price: 0.0025,
        average_gas_price: 0.025,
        high_gas_price: 0.04,
      },
    ],
  },
  registry: {
    bech32_prefix: "osmo",
    slip44: 118,
    staking: undefined,
    assets: [
      {
        description: "The native token of Osmosis",
        denom_units: [
          {
            denom: "uosmo",
            exponent: 0,
            aliases: [],
          },
          {
            denom: "osmo",
            exponent: 6,
            aliases: [],
          },
        ],
        type_asset: "sdk.coin",
        base: "uosmo",
        name: "Osmosis Testnet",
        display: "osmo",
        symbol: "OSMO",
        logo_URIs: {
          png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmo.png",
          svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmo.svg",
        },
        images: [
          {
            png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmo.png",
            svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmo.svg",
          },
        ],
        coingecko_id: "osmosis",
        keywords: ["dex", "staking"],
      },
    ],
  },
}
```

2. Update your project environment variables by

- adding your development `chainId` into `NEXT_PUBLIC_SUPPORTED_CHAIN_IDS`
- (move only) setting another variable `NEXT_PUBLIC_INITIA_MOVE_DECODER`

```bash
NEXT_PUBLIC_SUPPORTED_CHAIN_IDS=osmosis-1,osmo-test-5,<chainId>

# move only
NEXT_PUBLIC_INITIA_MOVE_DECODER=https://celatone-move-api-prod-jiod42ec2q-as.a.run.app
```
