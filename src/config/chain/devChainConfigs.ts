/* eslint-disable sonarjs/no-duplicate-string */
import type { ChainConfig } from "@alleslabs/shared";

export const devChainConfigs: ChainConfig[] = [
  // Write your chain config here.
  {
    tier: "lite",
    chainId: "bostrom",
    chain: "bostrom",
    registryChainName: "bostrom",
    prettyName: "Bostrom",
    lcd: "https://lcd.bostrom.cybernode.ai:443",
    rpc: "https://rpc.bostrom.cybernode.ai:443",
    wallets: ["keplr"],
    features: {
      wasm: {
        enabled: true,
        storeCodeMaxFileSize: 1_048_576,
        clearAdminGas: 1_048_576,
      },
      move: {
        enabled: false,
      },
      evm: {
        enabled: false,
      },
      pool: {
        enabled: false,
      },
      publicProject: {
        enabled: false,
      },
      gov: {
        enabled: true,
        version: "v1",
        hideOpenProposal: true,
      },
      nft: {
        enabled: false,
      },
    },
    gas: {
      gasAdjustment: 1.5,
      maxGasLimit: 20_000_000,
    },
    extra: {
      layer: "1",
    },
    network_type: "mainnet",
    logo_URIs: {
      png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/INIT.png",
      svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/INIT.svg",
    },
    fees: {
      fee_tokens: [
        {
          denom: "boot",
          fixed_min_gas_price: 0.2,
          low_gas_price: 0.2,
          average_gas_price: 0.2,
          high_gas_price: 0.5,
        },
      ],
    },
    registry: {
      bech32_prefix: "bostrom",
      slip44: 118,
      staking: {
        staking_tokens: [
          {
            denom: "boot",
          },
        ],
      },
      assets: [
        {
          description: "The native token of Bostrom",
          denom_units: [
            {
              denom: "boot",
              exponent: 0,
            },
          ],
          base: "boot",
          display: "BOOT",
          name: "BOSTROM Native Token",
          symbol: "BOOT",
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
      ],
    },
  },
  // {
  //   tier: "lite",
  //   chainId: "localinitia",
  //   chain: "localinitia",
  //   registryChainName: "localinitia",
  //   prettyName: "Local Initia",
  //   lcd: "http://localhost:1317",
  //   rpc: "http://localhost:26657",
  //   wallets: ["initia"],
  //   features: {
  //     wasm: {
  //       enabled: false,
  //     },
  //     move: {
  //       enabled: true,
  //       moduleMaxFileSize: 1_048_576,
  //     },
  //     evm: {
  //       enabled: false,
  //     },
  //     pool: {
  //       enabled: false,
  //     },
  //     publicProject: {
  //       enabled: false,
  //     },
  //     gov: {
  //       enabled: true,
  //       version: "v1",
  //       hideOpenProposal: true,
  //     },
  //     nft: {
  //       enabled: false,
  //     },
  //   },
  //   gas: {
  //     gasAdjustment: 1.5,
  //     maxGasLimit: 200_000_000,
  //   },
  //   extra: {
  //     layer: "1",
  //   },
  //   network_type: "testnet",
  //   logo_URIs: {
  //     png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/INIT.png",
  //     svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/INIT.svg",
  //   },
  //   fees: {
  //     fee_tokens: [
  //       {
  //         denom: "uinit",
  //         fixed_min_gas_price: 0.15,
  //         low_gas_price: 0.15,
  //         average_gas_price: 0.15,
  //         high_gas_price: 0.4,
  //       },
  //     ],
  //   },
  //   registry: {
  //     bech32_prefix: "init",
  //     slip44: 118,
  //     staking: {
  //       staking_tokens: [
  //         {
  //           denom: "uinit",
  //         },
  //       ],
  //     },
  //     assets: [
  //       {
  //         description: "The native token of Initia",
  //         denom_units: [
  //           {
  //             denom: "uinit",
  //             exponent: 0,
  //           },
  //           {
  //             denom: "INIT",
  //             exponent: 6,
  //           },
  //         ],
  //         base: "uinit",
  //         display: "INIT",
  //         name: "Initia Native Token",
  //         symbol: "INIT",
  //         images: [
  //           {
  //             png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/INIT.png",
  //             svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/INIT.svg",
  //           },
  //         ],
  //         logo_URIs: {
  //           png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/INIT.png",
  //           svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/initia/images/INIT.svg",
  //         },
  //       },
  //     ],
  //   },
  // },
];
