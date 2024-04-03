/* eslint-disable sonarjs/no-duplicate-string */
import type { AssetList, Chain } from "@chain-registry/types";

const CHAIN_SCHEMA = "../chain.schema.json";
const NODE_HOME = "$HOME/.init";

export const initiatestnet: Chain[] = [
  {
    $schema: CHAIN_SCHEMA,
    chain_name: "initiadevnet2",
    status: "live",
    network_type: "devnet",
    pretty_name: "Initia Devnet 2",
    chain_id: "mahalo-2",
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
          address: "https://rpc.mahalo-2.initia.xyz:443",
        },
      ],
      rest: [
        {
          address: "https://lcd.mahalo-2.initia.xyz",
        },
      ],
    },
  },
  {
    $schema: CHAIN_SCHEMA,
    chain_name: "minitiamovedevnet2",
    status: "live",
    network_type: "devnet",
    pretty_name: "Minitia Move Devnet 2",
    chain_id: "minimove-2",
    bech32_prefix: "init",
    daemon_name: "minitiad",
    node_home: NODE_HOME,
    key_algos: ["secp256k1"],
    slip44: 118,
    fees: {
      fee_tokens: [
        {
          denom:
            "l2/2588fd87a8e081f6a557f43ff14f05dddf5e34cb27afcefd6eaf81f1daea30d0",
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
          address: "https://rpc.minimove-2.initia.xyz:443",
        },
      ],
      rest: [
        {
          address: "https://lcd.minimove-2.initia.xyz",
        },
      ],
    },
  },
  {
    $schema: CHAIN_SCHEMA,
    chain_name: "minitiawasmdevnet2",
    status: "live",
    network_type: "devnet",
    pretty_name: "Minitia Wasm Devnet 2",
    chain_id: "miniwasm-2",
    bech32_prefix: "init",
    daemon_name: "minitiad",
    node_home: NODE_HOME,
    key_algos: ["secp256k1"],
    slip44: 118,
    fees: {
      fee_tokens: [
        {
          denom:
            "l2/771d639f30fbe45e3fbca954ffbe2fcc26f915f5513c67a4a2d0bc1d635bdefd",
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
          address: "https://rpc.miniwasm-2.initia.xyz:443",
        },
      ],
      rest: [
        {
          address: "https://lcd.miniwasm-2.initia.xyz",
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
  {
    $schema: CHAIN_SCHEMA,
    chain_name: "allesbugbash",
    status: "live",
    network_type: "testnet",
    pretty_name: "Initia Bug Bash",
    chain_id: "bug-bash",
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
          address: "http://35.247.147.50:26657",
        },
      ],
      rest: [
        {
          address: "http://35.247.147.50:1317",
        },
      ],
    },
  },
];

const ASSETLIST_SCHEMA = "../assetlist.schema.json";

export const initiatestnetAssets: AssetList[] = [
  {
    $schema: ASSETLIST_SCHEMA,
    chain_name: "initiadevnet2",
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
    chain_name: "minitiamovedevnet2",
    assets: [
      {
        description: "The native staking token of Initia.",
        denom_units: [
          {
            denom:
              "l2/2588fd87a8e081f6a557f43ff14f05dddf5e34cb27afcefd6eaf81f1daea30d0",
            exponent: 0,
          },
          {
            denom: "init",
            exponent: 6,
          },
        ],
        base: "l2/2588fd87a8e081f6a557f43ff14f05dddf5e34cb27afcefd6eaf81f1daea30d0",
        name: "Init",
        display: "init",
        symbol: "INIT",
      },
    ],
  },
  {
    $schema: ASSETLIST_SCHEMA,
    chain_name: "minitiawasmdevnet2",
    assets: [
      {
        description: "The native staking token of Initia.",
        denom_units: [
          {
            denom:
              "l2/771d639f30fbe45e3fbca954ffbe2fcc26f915f5513c67a4a2d0bc1d635bdefd",
            exponent: 0,
          },
          {
            denom: "init",
            exponent: 6,
          },
        ],
        base: "l2/771d639f30fbe45e3fbca954ffbe2fcc26f915f5513c67a4a2d0bc1d635bdefd",
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
  {
    $schema: ASSETLIST_SCHEMA,
    chain_name: "allesbugbash",
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
