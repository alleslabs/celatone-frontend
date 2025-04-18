import type { BechAddr32 } from "lib/types";

import { zBechAddr32 } from "lib/types";
import { z } from "zod";

export const zUpdateAdminQueryParams = z
  .object({
    contract: zBechAddr32.optional().default("" as BechAddr32),
  })
  .transform((val) => ({
    contractAddress: val.contract,
  }));
export type UpdateAdminQueryParams = z.infer<typeof zUpdateAdminQueryParams>;
