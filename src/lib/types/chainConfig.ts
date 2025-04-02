import type { ChainConfig } from "@alleslabs/shared";

import { z } from "zod";

export const zHttpsUrl = z
  .string()
  .trim()
  .regex(/^(http|https):\/\/[^\s/$.?#][^\s]*[^\s.?#]$/, {
    message: "Please enter a valid URL",
  });

export const zNumberInput = z.preprocess(
  (val) => (val === "" ? null : Number(val)),
  z.number({
    invalid_type_error: " ",
  })
);

export const zWasmConfig = z.union([
  z.object({
    enabled: z.literal(true),
    storeCodeMaxFileSize: z.number(),
    clearAdminGas: z.number(),
  }),
  z.object({
    enabled: z.literal(false),
  }),
]);

export const zMoveConfig = z.union([
  z.object({
    enabled: z.literal(true),
    moduleMaxFileSize: z.number(),
  }),
  z.object({
    enabled: z.literal(false),
  }),
]);

export const zEvmConfig = z.union([
  z.object({
    enabled: z.literal(true),
    jsonRpc: zHttpsUrl,
  }),
  z.object({
    enabled: z.literal(false),
  }),
]);

const zPoolConfig = z.union([
  z.object({
    enabled: z.literal(true),
    url: zHttpsUrl,
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
  faucetUrl: z.string().optional(),
  disableAnyOfAddresses: z.boolean().optional(),
  isValidatorExternalLink: z.string().nullish(),
  layer: z.union([z.literal("1"), z.literal("2")]).optional(),
});

export const zGasConfigCosts = z.object({
  cosmos_send: z.number().optional(),
  ibc_transfer: z.number().optional(),
});

export const zFeeToken = z.object({
  denom: z.string().trim(),
  fixed_min_gas_price: z.number().optional(),
  low_gas_price: z.number().optional(),
  average_gas_price: z.number().optional(),
  high_gas_price: z.number().optional(),
  gas_costs: zGasConfigCosts.optional(),
});

const zFeeConfig = z.object({
  fee_tokens: zFeeToken.array(),
});

export const zDenomUnit = z.object({
  denom: z.string().trim(),
  exponent: zNumberInput,
  aliases: z.string().array().optional(),
});

export const zAsset = z.object({
  deprecated: z.boolean().optional(),
  description: z.string().optional(),
  extended_description: z.string().optional(),
  type_asset: z.string().optional(),
  address: z.string().optional(),
  denom_units: zDenomUnit.array(),
  base: z.string().trim(),
  name: z.string().trim(),
  display: z.string(),
  symbol: z.string().trim(),
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
      theme: z
        .object({
          primary_color_hex: z.string().optional(),
          circle: z.boolean().optional(),
          dark_mode: z.boolean().optional(),
        })
        .optional(),
    })
    .array()
    .optional(),
  coingecko_id: z.string().optional(),
  keywords: z.string().array().optional(),
});

export const zRegistry = z.object({
  bech32_prefix: z.string(),
  slip44: z.number(),
  staking: z.union([
    z.undefined(),
    z.object({
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
  ]),
  assets: zAsset.array(),
});

export const zGasConfig = z.object({
  gasAdjustment: zNumberInput,
  maxGasLimit: zNumberInput,
});

export const zChainConfig = z
  .object({
    tier: z.union([
      z.literal("full"),
      z.literal("sequencer"),
      z.literal("mesa"),
      z.literal("lite"),
    ]),
    chainId: z.string().trim(),
    chain: z.string(),
    registryChainName: z.string().trim(),
    prettyName: z.string().trim(),
    rpc: zHttpsUrl,
    rest: zHttpsUrl,
    mesa: zHttpsUrl.optional(),
    wallets: z.array(
      z.union([z.literal("keplr"), z.literal("compass"), z.literal("station")])
    ),
    features: z.object({
      wasm: zWasmConfig,
      move: zMoveConfig,
      evm: zEvmConfig,
      pool: zPoolConfig,
      nft: zNftConfig,
      gov: zGovConfig,
      publicProject: zPublicProjectConfig,
    }),
    gas: zGasConfig,
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
