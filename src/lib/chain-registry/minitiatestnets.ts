import type { AssetList, Chain } from "@chain-registry/types";

export const minitiatestnets: Chain[] = [
  {
    $schema: "../chain.schema.json",
    chain_name: "game3",
    status: "live",
    network_type: "testnet",
    pretty_name: "Marketplace Minitia Testnet",
    chain_id: "game-3",
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
          address: "https://game-3-minitia-rpc.initia.tech",
        },
      ],
      rest: [
        {
          address: "https://game-3-minitia-rest.initia.tech",
        },
      ],
    },
  },
];

export const minitiatesnetAssets: AssetList[] = [
  {
    $schema: "../assetlist.schema.json",
    chain_name: "game3",
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
