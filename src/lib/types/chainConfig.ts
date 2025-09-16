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
    clearAdminGas: z.number(),
    enabled: z.literal(true),
    storeCodeMaxFileSize: z.number(),
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
    disableStoreCodeProposal: z.boolean().optional(),
    disableVotingPeriodTally: z.boolean().optional(),
    disableWhitelistProposal: z.boolean().optional(),
    enabled: z.literal(true),
    hideOpenProposal: z.boolean().optional(),
    version: z.union([z.literal("v1beta1"), z.literal("v1")]),
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
  faucetUrl: z.string().optional(),
  isValidatorExternalLink: z.string().nullish(),
  layer: z.union([z.literal("1"), z.literal("2")]).optional(),
});

export const zGasConfigCosts = z.object({
  cosmos_send: zNumberInput.optional(),
  ibc_transfer: zNumberInput.optional(),
});

export const zFeeToken = z.object({
  average_gas_price: zNumberInput.optional(),
  denom: z.string().trim(),
  fixed_min_gas_price: zNumberInput.optional(),
  gas_costs: zGasConfigCosts.optional(),
  high_gas_price: zNumberInput.optional(),
  low_gas_price: zNumberInput.optional(),
});

const zFeeConfig = z.object({
  fee_tokens: zFeeToken.array(),
});

export const zDenomUnit = z.object({
  aliases: z.string().array().optional(),
  denom: z.string().trim(),
  exponent: zNumberInput,
});

export const zAsset = z.object({
  address: z.string().optional(),
  base: z.string().trim(),
  coingecko_id: z.string().optional(),
  denom_units: zDenomUnit.array(),
  deprecated: z.boolean().optional(),
  description: z.string().optional(),
  display: z.string(),
  extended_description: z.string().optional(),
  images: z
    .object({
      image_sync: z
        .object({
          base_denom: z.string(),
          chain_name: z.string(),
        })
        .optional(),
      jpeg: z.string().optional(),
      png: z.string().optional(),
      svg: z.string().optional(),
      theme: z
        .object({
          circle: z.boolean().optional(),
          dark_mode: z.boolean().optional(),
          primary_color_hex: z.string().optional(),
        })
        .optional(),
    })
    .array()
    .optional(),
  keywords: z.string().array().optional(),
  logo_URIs: z
    .object({
      image_sync: z
        .object({
          base_denom: z.string(),
          chain_name: z.string(),
        })
        .optional(),
      jpeg: z.string().optional(),
      png: z.string().optional(),
      svg: z.string().optional(),
      theme: z.any().optional(),
    })
    .optional(),
  name: z.string().trim(),
  symbol: z.string().trim(),
  type_asset: z.string().optional(),
});

export const zRegistry = z.object({
  assets: zAsset.array(),
  bech32_prefix: z.string(),
  slip44: z.number(),
  staking: z.union([
    z.undefined(),
    z.object({
      lock_duration: z
        .object({
          blocks: z.number().optional(),
          time: z.string().optional(),
        })
        .optional(),
      staking_tokens: z
        .object({
          denom: z.string(),
        })
        .array(),
    }),
  ]),
});

export const zGasConfig = z.object({
  gasAdjustment: zNumberInput,
  maxGasLimit: zNumberInput,
});

export const zChainConfig = z
  .object({
    chain: z.string(),
    chainId: z.string().trim(),
    extra: zExtraConfig,
    features: z.object({
      evm: zEvmConfig,
      gov: zGovConfig,
      move: zMoveConfig,
      nft: zNftConfig,
      pool: zPoolConfig,
      publicProject: zPublicProjectConfig,
      wasm: zWasmConfig,
    }),
    fees: zFeeConfig,
    gas: zGasConfig,
    indexer: zHttpsUrl,
    logo_URIs: z
      .object({
        jpeg: z.string().optional(),
        png: z.string().optional(),
        svg: z.string().optional(),
      })
      .optional(),
    mesa: zHttpsUrl.optional(),
    network_type: z.union([
      z.literal("mainnet"),
      z.literal("testnet"),
      z.literal("devnet"),
      z.literal("local"),
    ]),
    prettyName: z.string().trim(),
    registry: zRegistry.optional(),
    registryChainName: z.string().trim(),
    rest: zHttpsUrl,
    rpc: zHttpsUrl,
    tier: z.union([
      z.literal("full"),
      z.literal("sequencer"),
      z.literal("mesa"),
      z.literal("lite"),
    ]),
    wallets: z.array(
      z.union([z.literal("keplr"), z.literal("compass"), z.literal("station")])
    ),
  })
  .transform<ChainConfig>((val) => val);

export const TierMap: Record<ChainConfig["tier"], number> = {
  full: 3,
  lite: 0,
  mesa: 1,
  sequencer: 2,
};

export const zNonInitiaChainConfig = z.object({
  chain_id: z.string(),
  chain_name: z.string(),
  logo_uri: z.string(),
  pretty_name: z.string(),
});
export type NonInitiaChainConfig = z.infer<typeof zNonInitiaChainConfig>;
