import { z, ZodIssueCode } from "zod";

export const zNetworkDetailsForm = z.object({
  networkName: z.string().superRefine(
    (val, ctx) =>
      val.length > 50 &&
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: `Minitia Name is too long. (${val.length}/50)`,
      })
  ),
  lcdUrl: z.string().url({ message: "Please enter a valid URL" }),
  rpcUrl: z.string().url({ message: "Please enter a valid URL" }),
  chainId: z.string().regex(/^[a-z-]+$/, {
    message: "Enter alphabet (a-z) and dash (-) only",
  }),
  registryChainName: z.string().regex(/^[a-z-]+$/, {
    message: "Enter alphabet (a-z) and dash (-) only",
  }),
  logoUri: z.string().min(0).url(),
});
export type NetworkDetailsForm = z.infer<typeof zNetworkDetailsForm>;

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

export const zAddNetworkManualForm =
  zNetworkDetailsForm.merge(zGasFeeDetailsForm);
export type AddNetworkManualForm = z.infer<typeof zAddNetworkManualForm>;
