import { z, ZodIssueCode } from "zod";

const pleaseEnterAValidUrl = "Please enter a valid URL";

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
  chainId: z.string().regex(/^[a-z-]+$/, {
    message: "Enter alphabet (a-z) and dash (-) only",
  }),
  registryChainName: z.string().regex(/^[a-z-]+$/, {
    message: "Enter alphabet (a-z) and dash (-) only",
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

export const zGasFeeDetailsForm = z.object({
  gasAdjustment: z.string(),
  maxGasLimit: z.string(),
  feeTokenDenom: z.string(),
  gasPrice: z.string(),
  fixedMinimumGasPrice: z.string(),
  lowGasPrice: z.string(),
  averageGasPrice: z.string(),
  highGasPrice: z.string(),
  gasForCosmosSend: z.string(),
  gasForIBC: z.string().url(),
});
export type GasFeeDetailsForm = z.infer<typeof zGasFeeDetailsForm>;

export const zAddNetworkManualForm = zNetworkDetailsForm
  .merge(zSupportedFeaturesForm)
  .merge(zGasFeeDetailsForm);
export type AddNetworkManualForm = z.infer<typeof zAddNetworkManualForm>;
