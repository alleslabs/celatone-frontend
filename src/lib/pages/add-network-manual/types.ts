import type { RefinementCtx } from "zod";
import { z, ZodIssueCode } from "zod";

const pleaseEnterAValidUrl = "Please enter a valid URL";
const mustBeAlphabetNumberAndSpecialCharacters =
  "Must be alphabet (a-z), numbers (0-9), or these special characters: “/”, “:”, “.”, “_”, “-”";
const mustBeNumbersOnly = "Must be numbers only";

export const zNetworkDetailsForm = z.object({
  networkName: z.string().superRefine(
    (val, ctx) =>
      val.length > 50 &&
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: `Minitia Name is too long. (${val.length}/50)`,
      })
  ),
  lcdUrl: z.string().url({ message: pleaseEnterAValidUrl }),
  rpcUrl: z.string().url({ message: pleaseEnterAValidUrl }),
  chainId: z.string().regex(/^[^\s]+$/, {
    message: "Required",
  }),
  registryChainName: z.string().regex(/^[a-z0-9]+$/, {
    message: "Lower case letter (a-z) or number (0-9)",
  }),
  logoUri: z.union([
    z.string().url({ message: "Please enter a valid URL" }),
    z.literal(""),
  ]),
});
export type NetworkDetailsForm = z.infer<typeof zNetworkDetailsForm>;

export const zSupportedFeaturesForm = z.object({
  isWasm: z.boolean(),
  isMove: z.boolean(),
  isNfts: z.boolean(),
});
export type SupportedFeaturesForm = z.infer<typeof zSupportedFeaturesForm>;

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
  exponent: z
    .union([
      z.literal(""),
      z.coerce.number({
        invalid_type_error: mustBeNumbersOnly,
      }),
    ])
    .refine((val) => val !== "", {
      message: " ",
    }),
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

export const zAddNetworkManualForm = zNetworkDetailsForm
  .merge(zSupportedFeaturesForm)
  .merge(zGasFeeDetailsForm.innerType())
  .merge(zWalletRegistryForm)
  .superRefine(gasConfigCustomFormValidator);

export type AddNetworkManualForm = z.infer<typeof zAddNetworkManualForm>;
