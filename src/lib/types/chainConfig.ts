import type { ChainConfig } from "@alleslabs/shared";
import { z } from "zod";

const zFaucetConfig = z.union([
  z.object({
    enabled: z.literal(true),
    url: z.string(),
  }),
  z.object({
    enabled: z.literal(false),
  }),
]);

const zWasmConfig = z.union([
  z.object({
    enabled: z.literal(true),
    storeCodeMaxFileSize: z.number(),
    clearAdminGas: z.number(),
  }),
  z.object({
    enabled: z.literal(false),
  }),
]);

const zMoveConfig = z.union([
  z.object({
    enabled: z.literal(true),
    moduleMaxFileSize: z.number(),
  }),
  z.object({
    enabled: z.literal(false),
  }),
]);

const zPoolConfig = z.union([
  z.object({
    enabled: z.literal(true),
    url: z.string(),
  }),
  z.object({
    enabled: z.literal(false),
  }),
]);

const zPublicProjectConfig = z.object({
  enabled: z.boolean(),
});

const zGovConfig = z.union([
  z.object({
    enabled: z.literal(true),
    version: z.union([z.literal("v1beta1"), z.literal("v1")]),
    hideOpenProposal: z.boolean().optional(),
    disableWhitelistProposal: z.boolean().optional(),
    disableStoreCodeProposal: z.boolean().optional(),
    disableVotingPeriodTally: z.boolean().optional(),
  }),
  z.object({
    enabled: z.literal(false),
  }),
]);

const zNftConfig = z.object({
  enabled: z.boolean(),
});

const zExtraConfig = z.object({
  disableAnyOfAddresses: z.boolean().optional(),
  isValidatorExternalLink: z.string().nullish(),
  layer: z.union([z.literal("1"), z.literal("2")]).optional(),
});

const zFeeConfig = z.object({
  fee_tokens: z
    .object({
      denom: z.string(),
      fixed_min_gas_price: z.number().optional(),
      low_gas_price: z.number().optional(),
      average_gas_price: z.number().optional(),
      high_gas_price: z.number().optional(),
      gas_costs: z
        .object({
          cosmos_send: z.number().optional(),
          ibc_transfer: z.number().optional(),
        })
        .optional(),
    })
    .array(),
});

const zAsset = z.object({
  deprecated: z.boolean().optional(),
  description: z.string().optional(),
  extended_description: z.string().optional(),
  type_asset: z.string().optional(),
  address: z.string().optional(),
  denom_units: z
    .object({
      denom: z.string(),
      exponent: z.number(),
      aliases: z.string().array().optional(),
    })
    .array(),
  base: z.string(),
  name: z.string(),
  display: z.string(),
  symbol: z.string(),
  logo_URIs: z
    .object({
      image_sync: z
        .object({
          chain_name: z.string(),
          base_denom: z.string(),
        })
        .optional(),
      png: z.string().optional(),
      svg: z.string().optional(),
      jpeg: z.string().optional(),
      theme: z.any().optional(),
    })
    .optional(),
  images: z
    .object({
      image_sync: z
        .object({
          chain_name: z.string(),
          base_denom: z.string(),
        })
        .optional(),
      png: z.string().optional(),
      svg: z.string().optional(),
      jpeg: z.string().optional(),
      theme: z.any().optional(),
    })
    .array()
    .optional(),
  coingecko_id: z.string().optional(),
  keywords: z.string().array().optional(),
});

const zRegistry = z.object({
  bech32_prefix: z.string(),
  slip44: z.number(),
  staking: z.object({
    staking_tokens: z
      .object({
        denom: z.string(),
      })
      .array(),
    lock_duration: z
      .object({
        blocks: z.number().optional(),
        time: z.string().optional(),
      })
      .optional(),
  }),
  assets: zAsset.array(),
});

export const zApiChainConfig = z
  .object({
    tier: z.union([
      z.literal("full"),
      z.literal("sequencer"),
      z.literal("mesa"),
      z.literal("lite"),
    ]),
    chainId: z.string(),
    chain: z.string(),
    registryChainName: z.string(),
    prettyName: z.string(),
    rpc: z.string(),
    lcd: z.string(),
    mesa: z.string().optional(),
    graphql: z.string().optional(),
    wallets: z.array(
      z.union([
        z.literal("keplr"),
        z.literal("initia"),
        z.literal("compass"),
        z.literal("station"),
      ])
    ),
    features: z.object({
      faucet: zFaucetConfig,
      gov: zGovConfig,
      move: zMoveConfig,
      nft: zNftConfig,
      pool: zPoolConfig,
      publicProject: zPublicProjectConfig,
      wasm: zWasmConfig,
    }),
    gas: z.object({
      gasAdjustment: z.number(),
      maxGasLimit: z.number(),
    }),
    extra: zExtraConfig,
    network_type: z.union([
      z.literal("mainnet"),
      z.literal("testnet"),
      z.literal("devnet"),
      z.literal("local"),
    ]),
    logo_URIs: z
      .object({
        png: z.string().optional(),
        svg: z.string().optional(),
        jpeg: z.string().optional(),
      })
      .optional(),
    fees: zFeeConfig,
    registry: zRegistry.optional(),
  })
  .transform<ChainConfig>((val) => val);

export const TierMap: Record<ChainConfig["tier"], number> = {
  lite: 0,
  mesa: 1,
  sequencer: 2,
  full: 3,
};
