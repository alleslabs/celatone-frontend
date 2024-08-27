import { z } from "zod";

import { zBechAddr } from "lib/types";

export const zEvmContractInfoResponseSequencer = z.object({
  sender: zBechAddr,
  created: z.date(),
});
export type EvmContractInfoResponseSequencer = z.infer<
  typeof zEvmContractInfoResponseSequencer
>;
