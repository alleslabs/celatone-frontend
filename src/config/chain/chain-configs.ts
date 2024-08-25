import type { ChainConfig } from "@alleslabs/shared";

const INIT_DENOM_BASE =
  "l2/2588fd87a8e081f6a557f43ff14f05dddf5e34cb27afcefd6eaf81f1daea30d0";
const USDC_DENOM_BASE =
  "ibc/8E27BA2D5493AF5636760E354E46004562C46AB7EC0CC4C1CA14E9E20E2545B5";

export const devChainConfigs: {
  [chainId: string]: ChainConfig;
} = {
  "miniwasm-2": {
    tier: "lite",
    chainId: "miniwasm-2",
    chain: "initia",
    registryChainName: "miniwasmtestnet",
    prettyName: "Miniwasm",
    lcd: "https://lcd.miniwasm-1.initia.xyz",
    rpc: "https://rpc.miniwasm-1.initia.xyz:443",
    graphql: "https://miniwasm-1-graphql.alleslabs.dev/v1/graphql",
    wallets: ["initia", "keplr"],
    features: {
      faucet: {
        enabled: false,
      },
      wasm: {
        enabled: true,
        storeCodeMaxFileSize: 800_000,
        clearAdminGas: 50_000,
      },
      move: {
        enabled: false,
      },
      pool: {
        enabled: false,
      },
      publicProject: {
        enabled: true,
      },
      gov: {
        enabled: false,
      },
      nft: {
        enabled: false,
      },
    },
    gas: {
      gasAdjustment: 1.5,
      maxGasLimit: 25_000_000,
    },
    extra: {
      isValidatorExternalLink: null,
      layer: "2",
    },

    network_type: "testnet",
    logo_URIs: {
      png: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/miniwasm/images/miniwasm.png",
      svg: "https://raw.githubusercontent.com/initia-labs/initia-registry/main/testnets/miniwasm/images/miniwasm.svg",
    },
    fees: {
      fee_tokens: [
        {
          denom: INIT_DENOM_BASE,
          fixed_min_gas_price: 0.15,
          low_gas_price: 0.15,
          average_gas_price: 0.15,
          high_gas_price: 0.4,
        },
        {
          denom: USDC_DENOM_BASE,
          fixed_min_gas_price: 0.15,
          low_gas_price: 0.15,
          average_gas_price: 0.15,
          high_gas_price: 0.4,
        },
      ],
    },

    registry: {
      bech32_prefix: "init",
      slip44: 118,
      staking: undefined,
      assets: [
        {
          description: "The native token of Initia",
          denom_units: [
            {
              denom: INIT_DENOM_BASE,
              exponent: 0,
            },
            {
              denom: "INIT",
              exponent: 6,
            },
          ],
          base: INIT_DENOM_BASE,
          display: "INIT",
          name: "Initia Native Token",
          symbol: "INIT",
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
              denom: USDC_DENOM_BASE,
              exponent: 0,
            },
            {
              denom: "USDC",
              exponent: 6,
            },
          ],
          base: USDC_DENOM_BASE,
          display: "USDC",
          name: "USDC",
          symbol: "USDC",
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
  },
};
