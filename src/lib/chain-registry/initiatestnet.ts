import type { Chain, AssetList } from "@chain-registry/types";

export const initiatestnet: Chain = {
  $schema: "../chain.schema.json",
  chain_name: "initiatestnet",
  status: "live",
  network_type: "testnet",
  pretty_name: "Initia Testnet",
  chain_id: "stone-9",
  bech32_prefix: "init",
  daemon_name: "initd",
  node_home: "$HOME/.init",
  key_algos: ["secp256k1"],
  slip44: 118,
  fees: {
    fee_tokens: [
      {
        denom: "uinit",
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
        denom: "uinit",
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
  apis: {
    rpc: [
      {
        address: "https://stone-rpc.initia.tech:443",
      },
    ],
    rest: [
      {
        address: "https://stone-rest.initia.tech",
      },
    ],
  },
};
export const initiatestnetAssets: AssetList = {
  $schema: "../assetlist.schema.json",
  chain_name: "initiatestnet",
  assets: [
    {
      description: "The native staking token of Initia.",
      denom_units: [
        {
          denom: "uinit",
          exponent: 0,
        },
        {
          denom: "init",
          exponent: 6,
        },
      ],
      base: "uinit",
      name: "Init",
      display: "init",
      symbol: "INIT",
    },
  ],
};
