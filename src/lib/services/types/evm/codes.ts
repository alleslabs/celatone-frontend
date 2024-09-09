import { z } from "zod";

import { is0x } from "lib/utils";

export const zEvmCodesByAddressResponseLcd = z.object({
  code: z.string().transform((val) => (is0x(val) ? null : val)),
});
export type EvmCodesByAddressResponseLcd = z.infer<
  typeof zEvmCodesByAddressResponseLcd
>;
