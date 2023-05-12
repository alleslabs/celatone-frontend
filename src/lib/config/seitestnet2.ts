import type { Chain, AssetList } from "@chain-registry/types";

export const seitestnet2: Chain = {
  $schema: "../../chain.schema.json",
  chain_name: "seitestnet2",
  chain_id: "atlantic-2",
  pretty_name: "Sei Atlantic 2",
  status: "live",
  network_type: "testnet",
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
      },
    ],
  },
  peers: {
    seeds: [
      {
        id: "f97a75fb69d3a5fe893dca7c8d238ccc0bd66a8f",
        address: "sei-testnet-2-seed.p2p.brocha.in:30587",
        provider: "Brochain",
      },
    ],
  },
  apis: {
    rpc: [
      {
        address: "https://sei-testnet-2-rpc.brocha.in",
        provider: "Brochain",
      },
    ],
    rest: [
      {
        address: "https://sei-testnet-2-rest.brocha.in",
        provider: "Brochain",
      },
    ],
  },
  explorers: [
    {
      kind: "explorers.guru",
      url: "https://sei.explorers.guru",
    },
    {
      kind: "Brochain",
      url: "https://testnet-explorer.brocha.in/sei%20atlantic%202",
    },
  ],
};

export const seitestnet2Assets: AssetList = {
  $schema: "../../assetlist.schema.json",
  chain_name: "seitestnet2",
  assets: [
    {
      description:
        "The native staking and governance token of the Atlantic testnet version of Sei.",
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
      logo_URIs: {
        png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/testnets/seitestnet2/images/sei.png",
      },
    },
  ],
};
