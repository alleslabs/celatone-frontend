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
    pretty_name: "Initia Closed Testnet 2",
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
    pretty_name: "Minitia Move Closed Testnet 2",
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
    pretty_name: "Minitia Wasm Closed Testnet 2",
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
    chain_name: "blackwingdevnet1",
    status: "live",
    network_type: "devnet",
    pretty_name: "Blackwing Closed Testnet 1",
    chain_id: "tomcat-1",
    bech32_prefix: "init",
    daemon_name: "minitiad",
    node_home: NODE_HOME,
    key_algos: ["secp256k1"],
    slip44: 118,
    fees: {
      fee_tokens: [
        {
          denom:
            "l2/ad2344d0c17127cc6bce67e360f43cd6c5fa09a7b5f6f9b7b80f9dc3e0c4876e",
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
          address:
            "https://maze-rpc-c64ef367-a391-4e71-901e-87951e5e9030.ue1-prod.newmetric.xyz",
        },
      ],
      rest: [
        {
          address:
            "https://maze-rest-c64ef367-a391-4e71-901e-87951e5e9030.ue1-prod.newmetric.xyz",
        },
      ],
    },
  },
  {
    $schema: CHAIN_SCHEMA,
    chain_name: "controtestnet1",
    status: "live",
    network_type: "devnet",
    pretty_name: "Contro Testnet 1",
    chain_id: "contro-test-1",
    bech32_prefix: "init",
    daemon_name: "minitiad",
    node_home: NODE_HOME,
    key_algos: ["secp256k1"],
    slip44: 118,
    fees: {
      fee_tokens: [
        {
          denom:
            "l2/2716295e82bab3b0308dc1e35837fe471657ea07ee71aebb6129739fb0f1278a",
          fixed_min_gas_price: 0.15,
          low_gas_price: 0.15,
          average_gas_price: 0.15,
          high_gas_price: 0.4,
        },
        {
          denom:
            "ibc/8E27BA2D5493AF5636760E354E46004562C46AB7EC0CC4C1CA14E9E20E2545B5",
          fixed_min_gas_price: 0.15,
          low_gas_price: 0.15,
          average_gas_price: 0.15,
          high_gas_price: 0.4,
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
          address:
            "https://maze-rpc-493360ba-cd86-4627-aca3-8b61635eb2bf.ue1-prod.newmetric.xyz",
        },
      ],
      rest: [
        {
          address:
            "https://maze-rest-493360ba-cd86-4627-aca3-8b61635eb2bf.ue1-prod.newmetric.xyz",
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
    chain_name: "blackwingdevnet1",
    assets: [
      {
        description: "The native staking token of Initia.",
        denom_units: [
          {
            denom:
              "l2/ad2344d0c17127cc6bce67e360f43cd6c5fa09a7b5f6f9b7b80f9dc3e0c4876e",
            exponent: 0,
          },
          {
            denom: "init",
            exponent: 6,
          },
        ],
        base: "l2/ad2344d0c17127cc6bce67e360f43cd6c5fa09a7b5f6f9b7b80f9dc3e0c4876e",
        name: "Init",
        display: "init",
        symbol: "INIT",
      },
    ],
  },
  {
    $schema: ASSETLIST_SCHEMA,
    chain_name: "controtestnet1",
    assets: [
      {
        description: "The native staking token of Initia.",
        denom_units: [
          {
            denom:
              "l2/2716295e82bab3b0308dc1e35837fe471657ea07ee71aebb6129739fb0f1278a",
            exponent: 0,
          },
          {
            denom: "init",
            exponent: 6,
          },
        ],
        base: "l2/2716295e82bab3b0308dc1e35837fe471657ea07ee71aebb6129739fb0f1278a",
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
