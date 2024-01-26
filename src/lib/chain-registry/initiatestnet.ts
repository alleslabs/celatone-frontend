/* eslint-disable sonarjs/no-duplicate-string */
import type { AssetList, Chain } from "@chain-registry/types";

const CHAIN_SCHEMA = "../chain.schema.json";
const NODE_HOME = "$HOME/.init";

export const initiatestnet: Chain[] = [
  {
    $schema: CHAIN_SCHEMA,
    chain_name: "initiadevnet1",
    status: "live",
    network_type: "devnet",
    pretty_name: "Initia Devnet 1",
    chain_id: "mahalo-1",
    bech32_prefix: "init",
    daemon_name: "initiad",
    node_home: NODE_HOME,
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
          address: "https://rpc.mahalo-1.initia.xyz:443",
        },
      ],
      rest: [
        {
          address: "https://lcd.mahalo-1.initia.xyz",
        },
      ],
    },
  },
  {
    $schema: CHAIN_SCHEMA,
    chain_name: "minitiamovedevnet1",
    status: "live",
    network_type: "devnet",
    pretty_name: "Minitia Move Devnet 1",
    chain_id: "minimove-1",
    bech32_prefix: "init",
    daemon_name: "minitiad",
    node_home: NODE_HOME,
    key_algos: ["secp256k1"],
    slip44: 118,
    fees: {
      fee_tokens: [
        {
          denom:
            "l2/4b66eb60bf9f503ea97fe4dc96d5c604c1dca14ee988e21510ac4b087bf72671",
          fixed_min_gas_price: 0,
          low_gas_price: 0.151,
          average_gas_price: 0.151,
          high_gas_price: 0.151,
        },
      ],
    },
    staking: undefined,
    logo_URIs: {
      png: "",
      svg: "",
    },
    apis: {
      rpc: [
        {
          address: "https://rpc.minimove-1.initia.xyz:443",
        },
      ],
      rest: [
        {
          address: "https://lcd.minimove-1.initia.xyz",
        },
      ],
    },
  },
  {
    $schema: CHAIN_SCHEMA,
    chain_name: "minitiawasmdevnet1",
    status: "live",
    network_type: "devnet",
    pretty_name: "Minitia Wasm Devnet 1",
    chain_id: "miniwasm-1",
    bech32_prefix: "init",
    daemon_name: "minitiad",
    node_home: NODE_HOME,
    key_algos: ["secp256k1"],
    slip44: 118,
    fees: {
      fee_tokens: [
        {
          denom:
            "l2/926dab95dc14918344374867b8576adee2c6cfca69b968fdb08c5280390cd1a7",
          fixed_min_gas_price: 0,
          low_gas_price: 0.151,
          average_gas_price: 0.151,
          high_gas_price: 0.151,
        },
      ],
    },
    staking: undefined,
    logo_URIs: {
      png: "",
      svg: "",
    },
    apis: {
      rpc: [
        {
          address: "https://rpc.miniwasm-1.initia.xyz:443",
        },
      ],
      rest: [
        {
          address: "https://lcd.miniwasm-1.initia.xyz",
        },
      ],
    },
  },
  {
    $schema: CHAIN_SCHEMA,
    chain_name: "initiatestnet13",
    status: "live",
    network_type: "testnet",
    pretty_name: "Initia Testnet 13",
    chain_id: "stone-13",
    bech32_prefix: "init",
    daemon_name: "initiad",
    node_home: NODE_HOME,
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
          address: "https://rpc.stone-13.initia.xyz:443",
        },
      ],
      rest: [
        {
          address: "https://lcd.stone-13.initia.xyz",
        },
      ],
    },
  },
];

const ASSETLIST_SCHEMA = "../assetlist.schema.json";

export const initiatestnetAssets: AssetList[] = [
  {
    $schema: ASSETLIST_SCHEMA,
    chain_name: "initiadevnet1",
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
    $schema: ASSETLIST_SCHEMA,
    chain_name: "minitiamovedevnet1",
    assets: [
      {
        description: "The native staking token of Initia.",
        denom_units: [
          {
            denom:
              "l2/4b66eb60bf9f503ea97fe4dc96d5c604c1dca14ee988e21510ac4b087bf72671",
            exponent: 0,
          },
          {
            denom: "init",
            exponent: 6,
          },
        ],
        base: "l2/4b66eb60bf9f503ea97fe4dc96d5c604c1dca14ee988e21510ac4b087bf72671",
        name: "Init",
        display: "init",
        symbol: "INIT",
      },
    ],
  },
  {
    $schema: ASSETLIST_SCHEMA,
    chain_name: "minitiawasmdevnet1",
    assets: [
      {
        description: "The native staking token of Initia.",
        denom_units: [
          {
            denom:
              "l2/926dab95dc14918344374867b8576adee2c6cfca69b968fdb08c5280390cd1a7",
            exponent: 0,
          },
          {
            denom: "init",
            exponent: 6,
          },
        ],
        base: "l2/926dab95dc14918344374867b8576adee2c6cfca69b968fdb08c5280390cd1a7",
        name: "Init",
        display: "init",
        symbol: "INIT",
      },
    ],
  },
  {
    $schema: ASSETLIST_SCHEMA,
    chain_name: "initiatestnet13",
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
