import type { ChainConfig } from "@alleslabs/shared";
import type { RefinementCtx } from "zod";
import { z, ZodIssueCode } from "zod";

import { INITIA_DECODER } from "config/chain/initia";

const pleaseEnterAValidUrl = "Please enter a valid URL";
const mustBeAlphabetNumberAndSpecialCharacters =
  "Must be alphabet (a-z), numbers (0-9), or these special characters: “/”, “:”, “.”, “_”, “-”";
const mustBeNumbersOnly = "Must be numbers only";

const zNumberForm = z
  .union([
    z.literal(""),
    z.coerce
      .number({
        invalid_type_error: mustBeNumbersOnly,
      })
      .nonnegative({ message: "Must be greater than 0" }),
  ])
  .optional();

const zNumberFormRequired = zNumberForm.superRefine((val, ctx) => {
  if (val === "")
    return ctx.addIssue({ code: ZodIssueCode.custom, message: " " });

  return true;
});

interface ValidateExistingChain {
  isChainIdExist: (chainId: string) => boolean;
  isPrettyNameExist: (name: string) => boolean;
}

export const zNetworkDetailsForm = ({
  isChainIdExist,
  isPrettyNameExist,
}: ValidateExistingChain) =>
  z.object({
    networkName: z.string().superRefine((val, ctx) => {
      if (val.length > 50)
        ctx.addIssue({
          code: ZodIssueCode.custom,
          message: `Minitia Name is too long. (${val.length}/50)`,
        });

      if (isPrettyNameExist(val))
        ctx.addIssue({
          code: ZodIssueCode.custom,
          message: "This name is already used. Please specify other name.",
        });

      return true;
    }),
    lcdUrl: z.string().url({ message: pleaseEnterAValidUrl }),
    rpcUrl: z.string().url({ message: pleaseEnterAValidUrl }),
    chainId: z
      .string()
      .min(1, { message: " " })
      .superRefine((val, ctx) => {
        if (isChainIdExist(val))
          ctx.addIssue({
            code: ZodIssueCode.custom,
            message: "This Chain ID is already added.",
          });

        return true;
      }),
    registryChainName: z.string().regex(/^[a-z0-9]+$/, {
      message: "Lower case letter (a-z) or number (0-9)",
    }),
    logoUri: z.union([
      z.string().url({ message: "Please enter a valid URL" }),
      z.literal(""),
    ]),
  });
export type NetworkDetailsForm = z.infer<
  ReturnType<typeof zNetworkDetailsForm>
>;

export const zSupportedFeaturesForm = z.object({
  isWasm: z.boolean(),
  isMove: z.boolean(),
  isNfts: z.boolean(),
});
export type SupportedFeaturesForm = z.infer<typeof zSupportedFeaturesForm>;

const zGasFeeDetails = z.object({
  gasAdjustment: zNumberFormRequired,
  maxGasLimit: zNumberFormRequired,
  feeTokenDenom: z.string().regex(/^[a-z0-9/:._-]+$/, {
    message: mustBeAlphabetNumberAndSpecialCharacters,
  }),
  gasConfig: z.enum(["standard", "custom"]),
  gasPrice: zNumberForm,
  fixedMinimumGasPrice: zNumberForm,
  lowGasPrice: zNumberForm,
  averageGasPrice: zNumberForm,
  highGasPrice: zNumberForm,
  gasForCosmosSend: zNumberForm,
  gasForIbc: zNumberForm,
});

export type GasFeeDetails = z.infer<typeof zGasFeeDetails>;

const gasConfigCustomFormValidator = (
  val: GasFeeDetails,
  ctx: RefinementCtx
) => {
  if (val.gasConfig === "custom") {
    if (val.fixedMinimumGasPrice === "")
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: " ",
        path: ["fixedMinimumGasPrice"],
      });

    if (val.lowGasPrice === "")
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: " ",
        path: ["lowGasPrice"],
      });

    if (val.averageGasPrice === "")
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: " ",
        path: ["averageGasPrice"],
      });

    if (val.highGasPrice === "")
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: " ",
        path: ["highGasPrice"],
      });
  }

  if (val.gasConfig === "standard" && val.gasPrice === "")
    ctx.addIssue({
      code: ZodIssueCode.custom,
      message: " ",
      path: ["gasPrice"],
    });
};

export const zGasFeeDetailsForm = zGasFeeDetails.superRefine(
  gasConfigCustomFormValidator
);

const zWalletRegistryAssetDenomForm = z.object({
  denom: z.string().regex(/^[a-z0-9/:._-]+$/, {
    message: mustBeAlphabetNumberAndSpecialCharacters,
  }),
  exponent: zNumberFormRequired,
});

const zWalletRegistryAssetForm = z.object({
  name: z.string().regex(/^[a-z-]+$/, {
    message: "Please enter only alphabet (a-z) and dash (-) with no spaces",
  }),
  base: z.string().regex(/^[a-z0-9/:._-]+$/, {
    message: mustBeAlphabetNumberAndSpecialCharacters,
  }),
  symbol: z.string().min(1, { message: " " }),
  denoms: z.array(zWalletRegistryAssetDenomForm),
});

export const zWalletRegistryForm = z.object({
  bech32Prefix: z.string().regex(/^[a-z]+$/, {
    message: "Alphabet (a-z) only",
  }),
  slip44: z.coerce
    .number({
      invalid_type_error: mustBeNumbersOnly,
    })
    .int({
      message: "Must be an integer",
    })
    .nonnegative({
      message: "Must be greater than 0",
    }),
  assets: z.array(zWalletRegistryAssetForm),
});
export type WalletRegistryForm = z.infer<typeof zWalletRegistryForm>;

export const zAddNetworkManualForm = ({
  isChainIdExist,
  isPrettyNameExist,
}: ValidateExistingChain) =>
  zNetworkDetailsForm({ isChainIdExist, isPrettyNameExist })
    .merge(zSupportedFeaturesForm)
    .merge(zGasFeeDetailsForm.innerType())
    .merge(zWalletRegistryForm)
    .superRefine(gasConfigCustomFormValidator);

export type AddNetworkManualForm = z.infer<
  ReturnType<typeof zAddNetworkManualForm>
>;

export const zAddNetworkManualChainConfigJson = ({
  isChainIdExist,
  isPrettyNameExist,
}: ValidateExistingChain) =>
  zAddNetworkManualForm({
    isChainIdExist,
    isPrettyNameExist,
  }).transform<ChainConfig>((val: AddNetworkManualForm) => ({
    tier: "sequencer",
    chainId: val.chainId,
    chain: "initia",
    registryChainName: val.registryChainName,
    prettyName: val.networkName,
    logo_URIs: {
      png: val.logoUri,
    },
    lcd: val.lcdUrl,
    rpc: val.rpcUrl,
    graphql: "",
    wallets: ["initia", "keplr"],
    features: {
      faucet: {
        enabled: false,
      },
      wasm: val.isWasm
        ? {
            enabled: true,
            storeCodeMaxFileSize: 1024 * 1024 * 2,
            clearAdminGas: 1000000,
          }
        : { enabled: false },
      move: val.isMove
        ? {
            enabled: true,
            moduleMaxFileSize: 1_048_576,
            decodeApi: INITIA_DECODER,
            verify: "",
          }
        : { enabled: false },
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
        enabled: val.isNfts,
      },
    },
    gas: {
      gasAdjustment: Number(val.gasAdjustment),
      maxGasLimit: Number(val.maxGasLimit),
    },
    extra: {
      isValidatorExternalLink: null,
      layer: "2",
    },
    network_type: "testnet",
    fees: {
      fee_tokens: [
        {
          denom: val.feeTokenDenom,
          fixed_min_gas_price: Number(val.fixedMinimumGasPrice),
          low_gas_price: Number(val.lowGasPrice),
          average_gas_price: Number(val.averageGasPrice),
          gas_costs: {
            cosmos_send: Number(val.gasForCosmosSend),
            ibc_transfer: Number(val.gasForIbc),
          },
        },
      ],
    },
    registry: {
      bech32_prefix: val.bech32Prefix,
      slip44: val.slip44,
      staking: {
        staking_tokens: [],
      },
      assets: val.assets.map((asset) => ({
        name: asset.name,
        base: asset.base,
        symbol: asset.symbol,
        denom_units: asset.denoms.map((denom) => ({
          denom: denom.denom,
          exponent: Number(denom.exponent),
        })),
        display: asset.symbol,
      })),
    },
  }));
