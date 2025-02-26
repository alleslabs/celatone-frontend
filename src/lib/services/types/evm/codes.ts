import { z } from "zod";

import { is0x } from "lib/utils";

export const zEvmCodesByAddressResponseRest = z.object({
  code: z.string().transform((val) => (is0x(val) ? null : val)),
});
export type EvmCodesByAddressResponseRest = z.infer<
  typeof zEvmCodesByAddressResponseRest
>;
