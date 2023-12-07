import type { AssetList, Chain } from "@chain-registry/types";

export const initiatestnet: Chain[] = [
  {
    $schema: "../chain.schema.json",
    chain_name: "initiatestnet11",
    status: "live",
    network_type: "testnet",
    pretty_name: "Initia Testnet 11",
    chain_id: "stone-11",
    bech32_prefix: "init",
    daemon_name: "initiad",
    node_home: "$HOME/.init",
    key_algos: ["secp256k1"],
    slip44: 118,
    fees: {
      fee_tokens: [
        {
          denom: "uinit",
          fixed_min_gas_price: 0,
          low_gas_price: 0.151,
          average_gas_price: 0.151,
          high_gas_price: 0.151,
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
  },
  {
    $schema: "../chain.schema.json",
    chain_name: "initiatestnet12-1",
    status: "live",
    network_type: "testnet",
    pretty_name: "Initia Testnet 12-1",
    chain_id: "stone-12-1",
    bech32_prefix: "init",
    daemon_name: "initiad",
    node_home: "$HOME/.init",
    key_algos: ["secp256k1"],
    slip44: 118,
    fees: {
      fee_tokens: [
        {
          denom: "uinit",
          fixed_min_gas_price: 0,
          low_gas_price: 0.151,
          average_gas_price: 0.151,
          high_gas_price: 0.151,
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
    logo_URIs: {
      png: "",
      svg: "",
    },
    apis: {
      rpc: [
        {
          address: "https://next-stone-rpc.initia.tech:443",
        },
      ],
      rest: [
        {
          address: "https://next-stone-rest.initia.tech",
        },
      ],
    },
  },
];

export const initiatestnetAssets: AssetList[] = [
  {
    $schema: "../assetlist.schema.json",
    chain_name: "initiatestnet11",
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
  },
  {
    $schema: "../assetlist.schema.json",
    chain_name: "initiatestnet12-1",
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
  },
];
