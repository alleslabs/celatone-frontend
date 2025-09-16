import type { ChainConfig } from "@alleslabs/shared";

export const devChainConfigs: ChainConfig[] = [
  // Write your chain config here.
  {
    chain: "localinitia",
    chainId: "localinitia",
    extra: {
      layer: "1",
    },
    features: {
      evm: {
        enabled: false,
      },
      gov: {
        enabled: true,
        hideOpenProposal: true,
        version: "v1",
      },
      move: {
        enabled: true,
        moduleMaxFileSize: 1_048_576,
      },
      nft: {
        enabled: false,
      },
      pool: {
        enabled: false,
      },
      publicProject: {
        enabled: false,
      },
      wasm: {
        enabled: false,
      },
    },
    fees: {
      fee_tokens: [
        {
          average_gas_price: 0.15,
          denom: "uinit",
          fixed_min_gas_price: 0.15,
          high_gas_price: 0.4,
          low_gas_price: 0.15,
        },
      ],
    },
    gas: {
      gasAdjustment: 1.5,
      maxGasLimit: 200_000_000,
    },
    indexer: "http://localhost:1317",
    logo_URIs: {
      png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/INIT.png",
      svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/INIT.svg",
    },
    network_type: "testnet",
    prettyName: "Local Initia",
    registry: {
      assets: [
        {
          base: "uinit",
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
          description: "The native token of Initia",
          display: "INIT",
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
          name: "Initia Native Token",
          symbol: "INIT",
        },
      ],
      bech32_prefix: "init",
      slip44: 118,
      staking: {
        staking_tokens: [
          {
            denom: "uinit",
          },
        ],
      },
    },
    registryChainName: "localinitia",
    rest: "http://localhost:1317",
    rpc: "http://localhost:26657",
    tier: "lite",
    wallets: ["keplr"],
  },
];
