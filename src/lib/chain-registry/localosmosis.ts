import type { AssetList, Chain } from "@chain-registry/types";

export const localosmosis: Chain = {
  $schema: "../chain.schema.json",
  chain_name: "localosmosis",
  status: "live",
  network_type: "devnet",
  pretty_name: "Local Osmosis",
  chain_id: "localosmosis",
  bech32_prefix: "osmo",
  daemon_name: "osmosisd",
  node_home: "$HOME/.osmosisd",
  key_algos: ["secp256k1"],
  slip44: 118,
  fees: {
    fee_tokens: [
      {
        denom: "uosmo",
        fixed_min_gas_price: 0.025,
        low_gas_price: 0.025,
        average_gas_price: 0.025,
        high_gas_price: 0.025,
      },
    ],
  },
  staking: {
    staking_tokens: [
      {
        denom: "uosmo",
      },
    ],
  },
  apis: {
    rpc: [
      {
        address: "http://localhost/rpc/",
      },
    ],
    rest: [
      {
        address: "http://localhost/rest",
      },
    ],
  },
  logo_URIs: {
    png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmosis-chain-logo.png",
  },
  keywords: ["devnet"],
};

export const localosmosisAsset: AssetList = {
  $schema: "../assetlist.schema.json",
  chain_name: "localosmosis",
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
      base: "uosmo",
      name: "Osmosis",
      display: "osmo",
      symbol: "OSMO",
      logo_URIs: {
        png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmo.png",
        svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmo.svg",
      },
      coingecko_id: "osmosis",
      keywords: ["dex", "staking"],
    },
  ],
};
