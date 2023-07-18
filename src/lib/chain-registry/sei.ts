import type { Chain, AssetList } from "@chain-registry/types";

export const sei: Chain = {
  $schema: "../chain.schema.json",
  chain_name: "sei",
  status: "live",
  website: "https://www.sei.io/",
  network_type: "mainnet",
  pretty_name: "Sei",
  chain_id: "pacific-1",
  bech32_prefix: "sei",
  daemon_name: "seid",
  node_home: "$HOME/.sei",
  key_algos: ["secp256k1"],
  slip44: 118,
  fees: {
    fee_tokens: [
      {
        denom: "usei",
        fixed_min_gas_price: 0,
        low_gas_price: 0,
        average_gas_price: 0.025,
        high_gas_price: 0.04,
      },
    ],
  },
  staking: {
    staking_tokens: [
      {
        denom: "usei",
      },
    ],
  },
  codebase: {
    git_repo: "https://github.com/sei-protocol/sei-chain",
    recommended_version: "v3.0.0",
    compatible_versions: ["v3.0.0"],
    cosmos_sdk_version: "",
    cosmwasm_enabled: true,
    genesis: {
      genesis_url: "",
    },
    versions: [
      {
        name: "v1",
      },
    ],
  },
  logo_URIs: {
    png: "",
    svg: "",
  },
  peers: {
    seeds: [
      {
        id: "20e1000e88125698264454a884812746c2eb4807",
        address: "seeds.lavenderfive.com:11956",
      },
    ],
    persistent_peers: [
      {
        id: "20e1000e88125698264454a884812746c2eb4807",
        address: "seeds.lavenderfive.com:11956",
      },
    ],
  },
  apis: {
    rpc: [
      {
        address: "https://sei-rpc.lavenderfive.com:443",
      },
    ],
    rest: [
      {
        address: "https://sei-api.lavenderfive.com:443",
        provider: "Lavender.Five Nodes 🐝",
      },
    ],
    grpc: [
      {
        address: "https://sei-grpc.lavenderfive.com:443",
        provider: "Lavender.Five Nodes 🐝",
      },
    ],
  },
  explorers: [
    {
      kind: "ping.pub",
      url: "https://ping.pub/sei",
    },
  ],
};
export const seiAssets: AssetList = {
  $schema: "../assetlist.schema.json",
  chain_name: "sei",
  assets: [
    {
      description: "The native staking token of Sei.",
      denom_units: [
        {
          denom: "usei",
          exponent: 0,
        },
        {
          denom: "sei",
          exponent: 6,
        },
      ],
      base: "usei",
      name: "Sei",
      display: "sei",
      symbol: "SEI",
    },
  ],
};
