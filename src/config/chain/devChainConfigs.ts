/* eslint-disable sonarjs/no-duplicate-string */
import type { ChainConfig } from "@alleslabs/shared";

export const devChainConfigs: ChainConfig[] = [
  // Write your chain config here.
  {
    tier: "lite",
    chainId: "localosmosis",
    chain: "localosmosis",
    registryChainName: "localosmosis",
    prettyName: "Local Osmosis",
    lcd: "https://lcd.osmotest5.osmosis.zone",
    rpc: "https://osmosis-testnet-rpc.polkachu.com:443",
    wallets: ["keplr"],
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
      evm: {
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
  },
];
