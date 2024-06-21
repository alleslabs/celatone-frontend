/* eslint-disable sonarjs/no-duplicate-string */
import type { AssetList, Chain } from "@chain-registry/types";

const CHAIN_SCHEMA = "../chain.schema.json";
const NODE_HOME = "$HOME/.init";
const NODE_HOME_MINITIA = "$HOME/.minitia";

export const initiatestnet: Chain[] = [
  {
    $schema: CHAIN_SCHEMA,
    chain_name: "initiatestnet",
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
          denom:
            "move/944f8dd8dc49f96c25fea9849f16436dcfa6d564eec802f3ef7f8b3ea85368ff",
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
            "move/944f8dd8dc49f96c25fea9849f16436dcfa6d564eec802f3ef7f8b3ea85368ff",
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
    chain_name: "minimovetestnet",
    status: "live",
    network_type: "testnet",
    pretty_name: "Minimove",
    chain_id: "minimove-1",
    bech32_prefix: "init",
    daemon_name: "initiad",
    node_home: NODE_HOME_MINITIA,
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
    chain_name: "miniwasmtestnet",
    status: "live",
    network_type: "testnet",
    pretty_name: "Miniwasm",
    chain_id: "miniwasm-1",
    bech32_prefix: "init",
    daemon_name: "initiad",
    node_home: NODE_HOME_MINITIA,
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
  {
    $schema: CHAIN_SCHEMA,
    chain_name: "blackwingtestnet",
    chain_id: "tomcat-1",
    website: "https://blackwing.fi",
    pretty_name: "Blackwing",
    status: "live",
    network_type: "testnet",
    daemon_name: "minitiad",
    node_home: NODE_HOME_MINITIA,
    key_algos: ["secp256k1"],
    slip44: 118,
    bech32_prefix: "init",
    fees: {
      fee_tokens: [
        {
          denom: "umin",
          fixed_min_gas_price: 0.15,
        },
        {
          denom:
            "l2/aee375e9d0b181f0d9d3a49f9a3d1d6b05d62b0ac81f8c92b9282afa4213d884",
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
    apis: {
      rpc: [
        {
          address:
            "https://maze-rpc-18bdff44-3aa4-425e-9bc0-06a2afa40af8.ase1-prod.newmetric.xyz",
        },
      ],
      rest: [
        {
          address:
            "https://maze-rest-18bdff44-3aa4-425e-9bc0-06a2afa40af8.ase1-prod.newmetric.xyz",
        },
      ],
    },
    explorers: [
      {
        kind: "initia scan",
        url: "https://scan.testnet.initia.xyz/tomcat-1",
      },
    ],
    images: [
      {
        png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/blackwing/images/BLACKWING.png",
        svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/blackwing/images/BLACKWING.svg",
      },
    ],
    logo_URIs: {
      png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/blackwing/images/BLACKWING.png",
      svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/blackwing/images/BLACKWING.svg",
    },
  },
  {
    $schema: CHAIN_SCHEMA,
    chain_name: "initaitestnet",
    chain_id: "init-ai-1",
    website: "https://init-ai.testnet.initia.xyz",
    pretty_name: "INIT AI",
    status: "live",
    network_type: "testnet",
    bech32_prefix: "init",
    daemon_name: "minitiad",
    node_home: NODE_HOME_MINITIA,
    key_algos: ["secp256k1"],
    slip44: 118,
    fees: {
      fee_tokens: [
        {
          denom:
            "l2/aadf1a9da6a38b7e7e11839364ee42002260eff1657f403b9ce608337bcb986b",
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
    codebase: {
      git_repo: "https://github.com/initia-labs/minimove",
      recommended_version: "v0.2.12",
      compatible_versions: ["v0.2.12", "main"],
      binaries: {
        "linux/amd64":
          "https://initia.s3.ap-southeast-1.amazonaws.com/minimove-1/minimove_v0.2.12_Linux_x86_64.tar.gz",
        "linux/arm64":
          "https://initia.s3.ap-southeast-1.amazonaws.com/minimove-1/minimove_v0.2.12_Linux_aarch64.tar.gz",
        "darwin/amd64":
          "https://initia.s3.ap-southeast-1.amazonaws.com/minimove-1/minimove_v0.2.12_Darwin_x86_64.tar.gz",
        "darwin/arm64":
          "https://initia.s3.ap-southeast-1.amazonaws.com/minimove-1/minimove_v0.2.12_Darwin_aarch64.tar.gz",
      },
      genesis: {
        genesis_url:
          "https://maze-rpc-617bacff-7d34-4eb8-87f4-ee16fb4e0ac7.ue1-prod.newmetric.xyz/genesis",
      },
      versions: [],
    },
    peers: {
      seeds: [],
      persistent_peers: [],
    },
    apis: {
      rpc: [
        {
          address:
            "https://maze-rpc-617bacff-7d34-4eb8-87f4-ee16fb4e0ac7.ue1-prod.newmetric.xyz",
        },
      ],
      rest: [
        {
          address:
            "https://maze-rest-617bacff-7d34-4eb8-87f4-ee16fb4e0ac7.ue1-prod.newmetric.xyz",
        },
      ],
    },
    explorers: [
      {
        kind: "initia scan",
        url: "https://scan.testnet.initia.xyz/init-ai-1",
      },
    ],
    images: [
      {
        png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/init_ai/images/init_ai.png",
        svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/init_ai/images/init_ai.svg",
      },
    ],
    logo_URIs: {
      png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/init_ai/images/init_ai.png",
      svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/init_ai/images/init_ai.svg",
    },
  },
  {
    $schema: CHAIN_SCHEMA,
    chain_name: "noontestnet",
    chain_id: "burrito-1",
    website: "https://lunchlunch.xyz",
    pretty_name: "Noon",
    status: "live",
    network_type: "testnet",
    daemon_name: "minitiad",
    node_home: NODE_HOME_MINITIA,
    key_algos: ["secp256k1"],
    slip44: 118,
    bech32_prefix: "init",
    fees: {
      fee_tokens: [
        {
          denom:
            "l2/ffea49d63cbadcfd749b4f635eca198b2f3b44cb1f6b580f5d201d58f3bf7aea",
          fixed_min_gas_price: 0.15,
          low_gas_price: 0.15,
          average_gas_price: 0.15,
          high_gas_price: 0.4,
        },
        {
          denom: "unoon",
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
    peers: {
      seeds: [],
      persistent_peers: [],
    },
    apis: {
      rpc: [
        {
          address: "https://burrito-1-rpc.lunchlunch.xyz",
        },
      ],
      rest: [
        {
          address: "https://burrito-1-lcd.lunchlunch.xyz",
        },
      ],
    },
    explorers: [
      {
        kind: "initia scan",
        url: "https://scan.testnet.initia.xyz/burrito-1",
      },
    ],
    images: [
      {
        png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/noon/images/NOON.png",
        svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/noon/images/NOON.svg",
      },
    ],
    logo_URIs: {
      png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/noon/images/NOON.png",
      svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/noon/images/NOON.svg",
    },
  },
  {
    $schema: CHAIN_SCHEMA,
    chain_name: "tucanatestnet",
    chain_id: "birdee-1",
    pretty_name: "Tucana",
    status: "live",
    network_type: "testnet",
    bech32_prefix: "init",
    daemon_name: "minitiad",
    key_algos: ["secp256k1"],
    slip44: 118,
    fees: {
      fee_tokens: [
        {
          denom: "utuc",
          fixed_min_gas_price: 0,
          low_gas_price: 0,
          average_gas_price: 0,
          high_gas_price: 0,
        },
      ],
    },
    apis: {
      rpc: [
        {
          address:
            "https://maze-rpc-c9796789-107d-49ab-b6de-059724d2a91d.ue1-prod.newmetric.xyz",
        },
      ],
      rest: [
        {
          address:
            "https://maze-rest-c9796789-107d-49ab-b6de-059724d2a91d.ue1-prod.newmetric.xyz",
        },
      ],
    },
    explorers: [
      {
        kind: "initia scan",
        url: "https://scan.testnet.initia.xyz/birdee-1",
      },
    ],
    images: [
      {
        png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/tucana/images/TUCANA.png",
        svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/tucana/images/TUCANA.svg",
      },
    ],
    logo_URIs: {
      png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/tucana/images/TUCANA.png",
      svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/tucana/images/TUCANA.svg",
    },
  },
  {
    $schema: CHAIN_SCHEMA,
    chain_name: "civitiatestnet",
    chain_id: "landlord-1",
    website: "https://www.civitia.xyz/",
    pretty_name: "Civitia",
    status: "live",
    network_type: "testnet",
    bech32_prefix: "init",
    daemon_name: "minitiad",
    node_home: NODE_HOME_MINITIA,
    key_algos: ["secp256k1"],
    slip44: 118,
    fees: {
      fee_tokens: [
        {
          denom:
            "l2/afaa3f4e1717c75712f8e8073e41f051a4e516cd25daa82d948c4729388edefd",
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
    codebase: {
      git_repo: "https://github.com/initia-labs/minimove",
      recommended_version: "v0.2.12",
      compatible_versions: ["v0.2.12", "main"],
      binaries: {
        "linux/amd64":
          "https://initia.s3.ap-southeast-1.amazonaws.com/minimove-1/minimove_v0.2.12_Linux_x86_64.tar.gz",
        "linux/arm64":
          "https://initia.s3.ap-southeast-1.amazonaws.com/minimove-1/minimove_v0.2.12_Linux_aarch64.tar.gz",
        "darwin/amd64":
          "https://initia.s3.ap-southeast-1.amazonaws.com/minimove-1/minimove_v0.2.12_Darwin_x86_64.tar.gz",
        "darwin/arm64":
          "https://initia.s3.ap-southeast-1.amazonaws.com/minimove-1/minimove_v0.2.12_Darwin_aarch64.tar.gz",
      },
      genesis: {
        genesis_url:
          "https://maze-rpc-sequencer-beab9b6f-d96d-435e-9caf-5679296d8172.ue1-prod.newmetric.xyz/genesis",
      },
      versions: [],
    },
    peers: {
      seeds: [],
      persistent_peers: [],
    },
    apis: {
      rpc: [
        {
          address:
            "https://maze-rpc-sequencer-beab9b6f-d96d-435e-9caf-5679296d8172.ue1-prod.newmetric.xyz",
          provider: "Foundation",
        },
      ],
      rest: [
        {
          address:
            "https://maze-rest-sequencer-beab9b6f-d96d-435e-9caf-5679296d8172.ue1-prod.newmetric.xyz",
          provider: "Foundation",
        },
      ],
    },
    explorers: [
      {
        kind: "initia scan",
        url: "https://explorer.testnet.initia.xyz/landlord-1",
      },
    ],
    images: [
      {
        png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/civitia/images/civitia.png",
        svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/civitia/images/civitia.svg",
      },
    ],
    logo_URIs: {
      png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/civitia/images/civitia.png",
      svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/civitia/images/civitia.svg",
    },
  },
];

const ASSETLIST_SCHEMA = "../assetlist.schema.json";

export const initiatestnetAssets: AssetList[] = [
  {
    $schema: ASSETLIST_SCHEMA,
    chain_name: "initiatestnet",
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
        display: "INIT",
        name: "Initia Native Token",
        symbol: "INIT",
        coingecko_id: "",
        images: [
          {
            png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/INIT.png",
            svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/INIT.svg",
          },
        ],
        logo_URIs: {
          png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/INIT.png",
          svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/INIT.svg",
        },
      },
      {
        description: "The gas token of Initia",
        denom_units: [
          {
            denom:
              "move/944f8dd8dc49f96c25fea9849f16436dcfa6d564eec802f3ef7f8b3ea85368ff",
            exponent: 0,
          },
          {
            denom: "GAS",
            exponent: 6,
          },
        ],
        base: "move/944f8dd8dc49f96c25fea9849f16436dcfa6d564eec802f3ef7f8b3ea85368ff",
        display: "GAS",
        name: "Gas Token",
        symbol: "GAS",
        coingecko_id: "",
        images: [
          {
            png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/GAS.png",
            svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/GAS.svg",
          },
        ],
        logo_URIs: {
          png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/GAS.png",
          svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/GAS.svg",
        },
      },
      {
        description: "The fake ETH",
        denom_units: [
          {
            denom: "ueth",
            exponent: 0,
          },
          {
            denom: "ETH",
            exponent: 6,
          },
        ],
        base: "ueth",
        display: "ETH",
        name: "Fake ETH Token",
        symbol: "ETH",
        coingecko_id: "",
        images: [
          {
            png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/ETH.png",
            svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/ETH.svg",
          },
        ],
        logo_URIs: {
          png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/ETH.png",
          svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/ETH.svg",
        },
      },
      {
        description: "The fake USDC",
        denom_units: [
          {
            denom: "uusdc",
            exponent: 0,
          },
          {
            denom: "USDC",
            exponent: 6,
          },
        ],
        base: "uusdc",
        display: "USDC",
        name: "Fake USDC Token",
        symbol: "USDC",
        coingecko_id: "",
        images: [
          {
            png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/USDC.png",
            svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/USDC.svg",
          },
        ],
        logo_URIs: {
          png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/USDC.png",
          svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/USDC.svg",
        },
      },
      {
        description: "The fake TIA",
        denom_units: [
          {
            denom: "utia",
            exponent: 0,
          },
          {
            denom: "TIA",
            exponent: 6,
          },
        ],
        base: "utia",
        display: "TIA",
        name: "Fake TIA Token",
        symbol: "TIA",
        coingecko_id: "",
        images: [
          {
            png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/TIA.png",
            svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/TIA.svg",
          },
        ],
        logo_URIs: {
          png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/TIA.png",
          svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/TIA.svg",
        },
      },
      {
        description: "The LP token of USDC-INIT",
        denom_units: [
          {
            denom:
              "move/dbf06c48af3984ec6d9ae8a9aa7dbb0bb1e784aa9b8c4a5681af660cf8558d7d",
            exponent: 0,
          },
          {
            denom: "USDC-INIT LP",
            exponent: 6,
          },
        ],
        base: "move/dbf06c48af3984ec6d9ae8a9aa7dbb0bb1e784aa9b8c4a5681af660cf8558d7d",
        display: "USDC-INIT LP",
        name: "USDC-INIT LP Token",
        symbol: "USDC-INIT LP",
        coingecko_id: "",
        images: [
          {
            png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/USDC-INIT.png",
            svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/USDC-INIT.svg",
          },
        ],
        logo_URIs: {
          png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/USDC-INIT.png",
          svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/USDC-INIT.svg",
        },
      },
      {
        description: "The LP token of ETH-INIT",
        denom_units: [
          {
            denom:
              "move/a2b0d3c8e53e379ede31f3a361ff02716d50ec53c6b65b8c48a81d5b06548200",
            exponent: 0,
          },
          {
            denom: "ETH-INIT LP",
            exponent: 6,
          },
        ],
        base: "move/a2b0d3c8e53e379ede31f3a361ff02716d50ec53c6b65b8c48a81d5b06548200",
        display: "ETH-INIT LP",
        name: "ETH-INIT LP Token",
        symbol: "ETH-INIT LP",
        coingecko_id: "",
        images: [
          {
            png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/ETH-INIT.png",
            svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/ETH-INIT.svg",
          },
        ],
        logo_URIs: {
          png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/ETH-INIT.png",
          svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/ETH-INIT.svg",
        },
      },
      {
        description: "The native token of Tucana",
        denom_units: [
          {
            denom:
              "ibc/276C63284D960E3E4D76AEFC9A8BA338BAD24E30530C7C95E7EFC4D250D4E23D",
            exponent: 0,
          },
          {
            denom: "TUC",
            exponent: 6,
          },
        ],
        base: "ibc/276C63284D960E3E4D76AEFC9A8BA338BAD24E30530C7C95E7EFC4D250D4E23D",
        display: "TUC",
        name: "Tucana Native Token",
        symbol: "TUC",
        coingecko_id: "",
        images: [
          {
            png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/tucana/images/TUCANA.png",
            svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/tucana/images/TUCANA.svg",
          },
        ],
        logo_URIs: {
          png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/tucana/images/TUCANA.png",
          svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/tucana/images/TUCANA.svg",
        },
      },
      {
        description: "The LP token of TIA-INIT",
        denom_units: [
          {
            denom:
              "move/b134ae6786f10ef74294e627d2519b63b7c742a6735f98682929fea9a84744d2",
            exponent: 0,
          },
          {
            denom: "TIA-INIT LP",
            exponent: 6,
          },
        ],
        base: "move/b134ae6786f10ef74294e627d2519b63b7c742a6735f98682929fea9a84744d2",
        display: "TIA-INIT LP",
        name: "TIA-INIT LP Token",
        symbol: "TIA-INIT LP",
        coingecko_id: "",
        images: [
          {
            png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/TIA-INIT.png",
            svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/TIA-INIT.svg",
          },
        ],
        logo_URIs: {
          png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/TIA-INIT.png",
          svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/TIA-INIT.svg",
        },
      },
      {
        description: "The LP token of Tucana",
        denom_units: [
          {
            denom:
              "ibc/73D13E2708E021B78521AE9EE6159EFABCBA892EF39E68A08F969955B025E3B1",
            exponent: 0,
          },
          {
            denom: "TLP",
            exponent: 6,
          },
        ],
        base: "ibc/73D13E2708E021B78521AE9EE6159EFABCBA892EF39E68A08F969955B025E3B1",
        display: "TLP",
        name: "Tucana Perps LP",
        symbol: "TLP",
        coingecko_id: "",
        images: [
          {
            png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/tucana/images/TUCANA-PERP.png",
            svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/tucana/images/TUCANA-PERP.svg",
          },
        ],
        logo_URIs: {
          png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/tucana/images/TUCANA-PERP.png",
          svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/tucana/images/TUCANA-PERP.svg",
        },
      },
    ],
  },
  {
    $schema: ASSETLIST_SCHEMA,
    chain_name: "minimovetestnet",
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
        display: "INIT",
        name: "Initia Native Token",
        symbol: "INIT",
        coingecko_id: "",
        images: [
          {
            png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/minimove/images/INIT.png",
            svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/minimove/images/INIT.svg",
          },
        ],
        logo_URIs: {
          png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/minimove/images/INIT.png",
          svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/minimove/images/INIT.svg",
        },
      },
      {
        description: "The fake USDC",
        denom_units: [
          {
            denom:
              "ibc/8E27BA2D5493AF5636760E354E46004562C46AB7EC0CC4C1CA14E9E20E2545B5",
            exponent: 0,
          },
          {
            denom: "USDC",
            exponent: 6,
          },
        ],
        base: "ibc/8E27BA2D5493AF5636760E354E46004562C46AB7EC0CC4C1CA14E9E20E2545B5",
        display: "USDC",
        name: "USDC",
        symbol: "USDC",
        coingecko_id: "",
        images: [
          {
            png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/minimove/images/USDC.png",
            svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/minimove/images/USDC.svg",
          },
        ],
        logo_URIs: {
          png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/minimove/images/USDC.png",
          svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/minimove/images/USDC.svg",
        },
      },
    ],
  },
  {
    $schema: ASSETLIST_SCHEMA,
    chain_name: "miniwasmtestnet",
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
        display: "INIT",
        name: "Initia Native Token",
        symbol: "INIT",
        coingecko_id: "",
        images: [
          {
            png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/minimove/images/INIT.png",
            svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/minimove/images/INIT.svg",
          },
        ],
        logo_URIs: {
          png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/minimove/images/INIT.png",
          svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/minimove/images/INIT.svg",
        },
      },
      {
        description: "The fake USDC",
        denom_units: [
          {
            denom:
              "ibc/8E27BA2D5493AF5636760E354E46004562C46AB7EC0CC4C1CA14E9E20E2545B5",
            exponent: 0,
          },
          {
            denom: "USDC",
            exponent: 6,
          },
        ],
        base: "ibc/8E27BA2D5493AF5636760E354E46004562C46AB7EC0CC4C1CA14E9E20E2545B5",
        display: "USDC",
        name: "USDC",
        symbol: "USDC",
        coingecko_id: "",
        images: [
          {
            png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/minimove/images/USDC.png",
            svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/minimove/images/USDC.svg",
          },
        ],
        logo_URIs: {
          png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/minimove/images/USDC.png",
          svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/minimove/images/USDC.svg",
        },
      },
    ],
  },
  {
    $schema: ASSETLIST_SCHEMA,
    chain_name: "blackwingtestnet",
    assets: [
      {
        description: "The native token of Initia",
        denom_units: [
          {
            denom:
              "l2/aee375e9d0b181f0d9d3a49f9a3d1d6b05d62b0ac81f8c92b9282afa4213d884",
            exponent: 0,
          },
          {
            denom: "INIT",
            exponent: 6,
          },
        ],
        base: "l2/aee375e9d0b181f0d9d3a49f9a3d1d6b05d62b0ac81f8c92b9282afa4213d884",
        display: "INIT",
        name: "Initia Native Token",
        symbol: "INIT",
        coingecko_id: "",
        images: [
          {
            png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/blackwing/images/INIT.png",
            svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/blackwing/images/INIT.svg",
          },
        ],
        logo_URIs: {
          png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/blackwing/images/INIT.png",
          svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/blackwing/images/INIT.svg",
        },
      },
      {
        description: "The fake USDC",
        denom_units: [
          {
            denom:
              "ibc/8E27BA2D5493AF5636760E354E46004562C46AB7EC0CC4C1CA14E9E20E2545B5",
            exponent: 0,
          },
          {
            denom: "USDC",
            exponent: 6,
          },
        ],
        base: "ibc/8E27BA2D5493AF5636760E354E46004562C46AB7EC0CC4C1CA14E9E20E2545B5",
        display: "USDC",
        name: "USDC",
        symbol: "USDC",
        coingecko_id: "",
        images: [
          {
            png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/blackwing/images/USDC.png",
            svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/blackwing/images/USDC.svg",
          },
        ],
        logo_URIs: {
          png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/blackwing/images/USDC.png",
          svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/blackwing/images/USDC.svg",
        },
      },
    ],
  },
  {
    $schema: ASSETLIST_SCHEMA,
    chain_name: "initaitestnet",
    assets: [
      {
        description: "The native token of Initia",
        denom_units: [
          {
            denom:
              "l2/aadf1a9da6a38b7e7e11839364ee42002260eff1657f403b9ce608337bcb986b",
            exponent: 0,
          },
          {
            denom: "INIT",
            exponent: 6,
          },
        ],
        base: "l2/aadf1a9da6a38b7e7e11839364ee42002260eff1657f403b9ce608337bcb986b",
        display: "INIT",
        name: "Initia Native Token",
        symbol: "INIT",
        coingecko_id: "",
        images: [
          {
            png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/init_ai/images/INIT.png",
            svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/init_ai/images/INIT.svg",
          },
        ],
        logo_URIs: {
          png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/init_ai/images/INIT.png",
          svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/init_ai/images/INIT.svg",
        },
      },
    ],
  },
  {
    $schema: ASSETLIST_SCHEMA,
    chain_name: "noontestnet",
    assets: [
      {
        description: "The native token of Initia",
        denom_units: [
          {
            denom:
              "l2/ffea49d63cbadcfd749b4f635eca198b2f3b44cb1f6b580f5d201d58f3bf7aea",
            exponent: 0,
          },
          {
            denom: "INIT",
            exponent: 6,
          },
        ],
        base: "l2/ffea49d63cbadcfd749b4f635eca198b2f3b44cb1f6b580f5d201d58f3bf7aea",
        display: "INIT",
        name: "Initia Native Token",
        symbol: "INIT",
        coingecko_id: "",
        images: [
          {
            png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/noon/images/INIT.png",
            svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/noon/images/INIT.svg",
          },
        ],
        logo_URIs: {
          png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/noon/images/INIT.png",
          svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/noon/images/INIT.svg",
        },
      },
    ],
  },
  {
    $schema: ASSETLIST_SCHEMA,
    chain_name: "tucanatestnet",
    assets: [
      {
        description: "The native token of Initia",
        denom_units: [
          {
            denom:
              "l2/333f8e6ae6855338f99d451126bfefc1b920763c16681d55fbc7df68ccb36972",
            exponent: 0,
          },
          {
            denom: "INIT",
            exponent: 6,
          },
        ],
        base: "l2/333f8e6ae6855338f99d451126bfefc1b920763c16681d55fbc7df68ccb36972",
        display: "INIT",
        name: "Initia Native Token",
        symbol: "INIT",
        coingecko_id: "",
        images: [
          {
            png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/INIT.png",
            svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/INIT.svg",
          },
        ],
        logo_URIs: {
          png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/INIT.png",
          svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/INIT.svg",
        },
      },
      {
        description: "The native token of Tucana",
        denom_units: [
          {
            denom: "utuc",
            exponent: 0,
          },
          {
            denom: "TUC",
            exponent: 6,
          },
        ],
        base: "utuc",
        display: "TUC",
        name: "Tucana Native Token",
        symbol: "TUC",
        coingecko_id: "",
        images: [
          {
            png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/tucana/images/TUCANA.png",
            svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/tucana/images/TUCANA.svg",
          },
        ],
        logo_URIs: {
          png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/tucana/images/TUCANA.png",
          svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/tucana/images/TUCANA.svg",
        },
      },
      {
        description: "The fake USDC",
        denom_units: [
          {
            denom:
              "ibc/8E27BA2D5493AF5636760E354E46004562C46AB7EC0CC4C1CA14E9E20E2545B5",
            exponent: 0,
          },
          {
            denom: "USDC",
            exponent: 6,
          },
        ],
        base: "ibc/8E27BA2D5493AF5636760E354E46004562C46AB7EC0CC4C1CA14E9E20E2545B5",
        display: "USDC",
        name: "USDC",
        symbol: "USDC",
        coingecko_id: "",
        images: [
          {
            png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/minimove/images/USDC.png",
            svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/minimove/images/USDC.svg",
          },
        ],
        logo_URIs: {
          png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/minimove/images/USDC.png",
          svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/minimove/images/USDC.svg",
        },
      },
      {
        description: "The LP token of Tucana",
        denom_units: [
          {
            denom:
              "move/17bf475fe65c54864db2ba45883b8d3fa198d80e4edd31088fd41d505075080b",
            exponent: 0,
          },
          {
            denom: "TLP",
            exponent: 6,
          },
        ],
        base: "move/17bf475fe65c54864db2ba45883b8d3fa198d80e4edd31088fd41d505075080b",
        display: "TLP",
        name: "Tucana Perps LP",
        symbol: "TLP",
        coingecko_id: "",
        images: [
          {
            png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/tucana/images/TUCANA-PERP.png",
            svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/tucana/images/TUCANA-PERP.svg",
          },
        ],
        logo_URIs: {
          png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/tucana/images/TUCANA-PERP.png",
          svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/tucana/images/TUCANA-PERP.svg",
        },
      },
    ],
  },
  {
    $schema: ASSETLIST_SCHEMA,
    chain_name: "civitiatestnet",
    assets: [
      {
        description: "The native token of Initia",
        denom_units: [
          {
            denom:
              "l2/afaa3f4e1717c75712f8e8073e41f051a4e516cd25daa82d948c4729388edefd",
            exponent: 0,
          },
          {
            denom: "INIT",
            exponent: 6,
          },
        ],
        base: "l2/afaa3f4e1717c75712f8e8073e41f051a4e516cd25daa82d948c4729388edefd",
        display: "INIT",
        name: "Initia Native Token",
        symbol: "INIT",
        coingecko_id: "",
        images: [
          {
            png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/civitia/images/INIT.png",
            svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/civitia/images/INIT.svg",
          },
        ],
        logo_URIs: {
          png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/civitia/images/INIT.png",
          svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/civitia/images/INIT.svg",
        },
      },
    ],
  },
];
