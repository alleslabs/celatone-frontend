import { z } from "zod";

export const zEvmCodesByAddressResponseLcd = z.object({
  code: z.string(),
});
export type EvmCodesByAddressResponseLcd = z.infer<
  typeof zEvmCodesByAddressResponseLcd
>;
