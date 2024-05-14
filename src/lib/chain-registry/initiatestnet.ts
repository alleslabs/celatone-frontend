/* eslint-disable sonarjs/no-duplicate-string */
import type { AssetList, Chain } from "@chain-registry/types";

const CHAIN_SCHEMA = "../chain.schema.json";
const NODE_HOME = "$HOME/.init";

export const initiatestnet: Chain[] = [
  {
    $schema: CHAIN_SCHEMA,
    chain_name: "initiadevnet3",
    status: "live",
    network_type: "devnet",
    pretty_name: "Initia Closed Testnet 3",
    chain_id: "mahalo-3",
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
          address: "https://rpc.mahalo-3.initia.xyz:443",
        },
      ],
      rest: [
        {
          address: "https://lcd.mahalo-3.initia.xyz",
        },
      ],
    },
  },
  {
    $schema: CHAIN_SCHEMA,
    chain_name: "minitiamovedevnet3",
    status: "live",
    network_type: "devnet",
    pretty_name: "Minitia Move Closed Testnet 3",
    chain_id: "minimove-3",
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
          address: "https://rpc.minimove-3.initia.xyz:443",
        },
      ],
      rest: [
        {
          address: "https://lcd.minimove-3.initia.xyz",
        },
      ],
    },
  },
  {
    $schema: CHAIN_SCHEMA,
    chain_name: "minitiawasmdevnet3",
    status: "live",
    network_type: "devnet",
    pretty_name: "Minitia Wasm Closed Testnet 3",
    chain_id: "miniwasm-3",
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
          address: "https://rpc.miniwasm-3.initia.xyz:443",
        },
      ],
      rest: [
        {
          address: "https://lcd.miniwasm-3.initia.xyz",
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
    chain_name: "initiatestnet1",
    status: "live",
    network_type: "testnet",
    pretty_name: "Initia",
    chain_id: "initiation-1",
    bech32_prefix: "init",
    daemon_name: "initiad",
    node_home: NODE_HOME,
    key_algos: ["secp256k1"],
    slip44: 118,
    fees: {
      fee_tokens: [
        {
          denom: "uinit",
          fixed_min_gas_price: 0.15,
          low_gas_price: 0.15,
          average_gas_price: 0.15,
          high_gas_price: 0.4,
        },
        {
          denom: "ueth",
        },
        {
          denom: "uusdc",
        },
        {
          denom: "utia",
        },
      ],
    },
    staking: {
      staking_tokens: [
        {
          denom: "uinit",
        },
        {
          denom:
            "move/dbf06c48af3984ec6d9ae8a9aa7dbb0bb1e784aa9b8c4a5681af660cf8558d7d",
        },
        {
          denom:
            "move/a2b0d3c8e53e379ede31f3a361ff02716d50ec53c6b65b8c48a81d5b06548200",
        },
        {
          denom:
            "move/b134ae6786f10ef74294e627d2519b63b7c742a6735f98682929fea9a84744d2",
        },
      ],
    },
    logo_URIs: {
      png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/INIT.png",
      svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/INIT.svg",
    },
    apis: {
      rpc: [
        {
          address: "https://rpc.initiation-1.initia.xyz:443",
        },
      ],
      rest: [
        {
          address: "https://lcd.initiation-1.initia.xyz",
        },
      ],
    },
  },
  {
    $schema: CHAIN_SCHEMA,
    chain_name: "minitiamovetestnet1",
    status: "live",
    network_type: "testnet",
    pretty_name: "Minimove",
    chain_id: "minimove-1",
    bech32_prefix: "init",
    daemon_name: "initiad",
    node_home: NODE_HOME,
    key_algos: ["secp256k1"],
    slip44: 118,
    fees: {
      fee_tokens: [
        {
          denom:
            "l2/771d639f30fbe45e3fbca954ffbe2fcc26f915f5513c67a4a2d0bc1d635bdefd",
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
    staking: {
      staking_tokens: [],
    },
    logo_URIs: {
      png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/minimove/images/minimove.png",
      svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/minimove/images/minimove.svg",
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
    chain_name: "minitiawasmtestnet1",
    status: "live",
    network_type: "testnet",
    pretty_name: "Miniwasm",
    chain_id: "miniwasm-1",
    bech32_prefix: "init",
    daemon_name: "initiad",
    node_home: NODE_HOME,
    key_algos: ["secp256k1"],
    slip44: 118,
    fees: {
      fee_tokens: [
        {
          denom:
            "l2/2588fd87a8e081f6a557f43ff14f05dddf5e34cb27afcefd6eaf81f1daea30d0",
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
    staking: {
      staking_tokens: [],
    },
    logo_URIs: {
      png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/miniwasm/images/miniwasm.png",
      svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/miniwasm/images/miniwasm.svg",
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
];

const ASSETLIST_SCHEMA = "../assetlist.schema.json";

export const initiatestnetAssets: AssetList[] = [
  {
    $schema: ASSETLIST_SCHEMA,
    chain_name: "initiadevnet3",
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
    chain_name: "minitiamovedevnet3",
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
    chain_name: "minitiawasmdevnet3",
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
    chain_name: "initiatestnet1",
    assets: [
      {
        description: "The native token of Initia",
        denom_units: [
          {
            denom: "uinit",
            exponent: 0,
          },
          {
            denom: "INIT",
            exponent: 6,
          },
        ],
        base: "uinit",
        name: "Initia Native Token",
        display: "INIT",
        symbol: "INIT",
      },
    ],
  },
  {
    $schema: ASSETLIST_SCHEMA,
    chain_name: "minitiamovetestnet1",
    assets: [
      {
        description: "The native token of Initia",
        denom_units: [
          {
            denom:
              "l2/771d639f30fbe45e3fbca954ffbe2fcc26f915f5513c67a4a2d0bc1d635bdefd",
            exponent: 0,
          },
          {
            denom: "INIT",
            exponent: 6,
          },
        ],
        base: "l2/771d639f30fbe45e3fbca954ffbe2fcc26f915f5513c67a4a2d0bc1d635bdefd",
        name: "Initia Native Token",
        display: "INIT",
        symbol: "INIT",
      },
    ],
  },
  {
    $schema: ASSETLIST_SCHEMA,
    chain_name: "minitiawasmtestnet1",
    assets: [
      {
        description: "The native token of Initia",
        denom_units: [
          {
            denom:
              "l2/2588fd87a8e081f6a557f43ff14f05dddf5e34cb27afcefd6eaf81f1daea30d0",
            exponent: 0,
          },
          {
            denom: "INIT",
            exponent: 6,
          },
        ],
        base: "l2/2588fd87a8e081f6a557f43ff14f05dddf5e34cb27afcefd6eaf81f1daea30d0",
        name: "Initia Native Token",
        display: "INIT",
        symbol: "INIT",
      },
    ],
  },
];
