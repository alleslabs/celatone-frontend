import type { ChainConfig } from "@alleslabs/shared";
import type { RefinementCtx } from "zod";
import { z, ZodIssueCode } from "zod";

const mustBeAlphabetNumberAndSpecialCharacters =
  "Must be alphabet (a-z), numbers (0-9), or these special characters: “/”, “:”, “.”, “_”, “-”";
const mustBeNumbersOnly = "Must be numbers only";

const zHttpsUrl = z.string().regex(/^(http|https):\/\/[^\s$.?#].[^\s]*$/, {
  message: "Please enter a valid URL",
});

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

export enum VmType {
  MOVE = "move",
  WASM = "wasm",
}

export const zNetworkDetailsForm = ({
  isChainIdExist,
  isPrettyNameExist,
}: ValidateExistingChain) =>
  z.object({
    vmType: z.nativeEnum(VmType),
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
    lcdUrl: zHttpsUrl,
    rpcUrl: zHttpsUrl,
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
    logoUri: z.union([zHttpsUrl, z.literal("")]),
  });
export type NetworkDetailsForm = z.infer<
  ReturnType<typeof zNetworkDetailsForm>
>;

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
      png: val.logoUri || undefined,
    },
    lcd: val.lcdUrl,
    rpc: val.rpcUrl,
    graphql: "",
    wallets: ["initia", "keplr"],
    features: {
      faucet: {
        enabled: false,
      },
      wasm:
        val.vmType === VmType.WASM
          ? {
              enabled: true,
              storeCodeMaxFileSize: 1024 * 1024 * 2,
              clearAdminGas: 1000000,
            }
          : { enabled: false },
      move:
        val.vmType === VmType.MOVE
          ? {
              enabled: true,
              moduleMaxFileSize: 1_048_576,
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
        enabled: val.vmType === VmType.MOVE,
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
    network_type: "local",
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

export type AddNetworkManualChainConfigJson = z.infer<
  ReturnType<typeof zAddNetworkManualChainConfigJson>
>;

export const zAddNetworkJsonChainConfigJson = z.object({
  tier: z.enum(["full", "sequencer", "mesa", "lite"]),
  chainId: z.string(),
  chain: z.string(),
  registryChainName: z.string(),
  prettyName: z.string(),
  logo_URIs: z.object({
    png: z.string().optional(),
  }),
  lcd: zHttpsUrl,
  rpc: zHttpsUrl,
  graphql: z.string(),
  wallets: z.array(z.string()),
  features: z.object({
    faucet: z.object({
      enabled: z.boolean(),
    }),
    wasm: z.object({
      enabled: z.boolean(),
      storeCodeMaxFileSize: z.number().optional(),
      clearAdminGas: z.number().optional(),
    }),
    move: z.object({
      enabled: z.boolean(),
      moduleMaxFileSize: z.number().optional(),
    }),
    pool: z.object({
      enabled: z.boolean(),
    }),
    publicProject: z.object({
      enabled: z.boolean(),
    }),
    gov: z.object({
      enabled: z.boolean(),
    }),
    nft: z.object({
      enabled: z.boolean(),
    }),
  }),
  gas: z.object({
    gasAdjustment: z.number(),
    maxGasLimit: z.number(),
  }),
  extra: z.object({
    isValidatorExternalLink: z.string().nullable(),
    layer: z.string(),
  }),
  network_type: z.string(),
  fees: z.object({
    fee_tokens: z.array(
      z.object({
        denom: z.string(),
        fixed_min_gas_price: z.number(),
        low_gas_price: z.number(),
        average_gas_price: z.number(),
        gas_costs: z.object({
          cosmos_send: z.number(),
          ibc_transfer: z.number(),
        }),
      })
    ),
  }),
  registry: z.object({
    bech32_prefix: z.string(),
    slip44: z.number(),
    staking: z.object({
      staking_tokens: z.array(z.object({})),
    }),
    assets: z.array(
      z.object({
        name: z.string(),
        base: z.string(),
        symbol: z.string(),
        denom_units: z.array(
          z.object({
            denom: z.string(),
            exponent: z.number(),
          })
        ),
        display: z.string(),
      })
    ),
  }),
});

export type AddNetworkJsonChainConfigJson = z.infer<
  typeof zAddNetworkJsonChainConfigJson
>;
