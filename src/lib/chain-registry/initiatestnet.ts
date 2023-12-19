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
    daemon_name: "initiad",
    node_home: NODE_HOME,
    key_algos: ["secp256k1"],
    slip44: 118,
    fees: {
      fee_tokens: [
        {
          denom: "umin",
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
    daemon_name: "initiad",
    node_home: NODE_HOME,
    key_algos: ["secp256k1"],
    slip44: 118,
    fees: {
      fee_tokens: [
        {
          denom: "umin",
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
    chain_name: "initiatestnet12-1",
    status: "live",
    network_type: "testnet",
    pretty_name: "Initia Testnet 12-1",
    chain_id: "stone-12-1",
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
        description: "The native staking token of Minitia.",
        denom_units: [
          {
            denom: "umin",
            exponent: 0,
          },
          {
            denom: "min",
            exponent: 6,
          },
        ],
        base: "umin",
        name: "Min",
        display: "min",
        symbol: "MIN",
      },
    ],
  },
  {
    $schema: ASSETLIST_SCHEMA,
    chain_name: "minitiawasmdevnet1",
    assets: [
      {
        description: "The native staking token of Minitia.",
        denom_units: [
          {
            denom: "umin",
            exponent: 0,
          },
          {
            denom: "min",
            exponent: 6,
          },
        ],
        base: "umin",
        name: "Min",
        display: "min",
        symbol: "MIN",
      },
    ],
  },
  {
    $schema: ASSETLIST_SCHEMA,
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
