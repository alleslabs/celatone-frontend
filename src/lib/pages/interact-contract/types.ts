import { z } from "zod";

import { ContractInteractionTabs, zBechAddr32 } from "lib/types";

export const zInteractContractQueryParams = z.object({
  selectedType: z.union([
    z.nativeEnum(ContractInteractionTabs),
    z
      .string()
      .optional()
      .transform(() => ContractInteractionTabs.QueryContract),
  ]),
  contract: zBechAddr32.default(""),
  msg: z.string().default(""),
});

export type InteractContractQueryParams = z.infer<
  typeof zInteractContractQueryParams
>;
