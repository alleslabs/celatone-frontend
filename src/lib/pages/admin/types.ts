import { z } from "zod";

import type { BechAddr32 } from "lib/types";
import { zBechAddr32 } from "lib/types";

export const zUpdateAdminQueryParams = z
  .object({
    contract: zBechAddr32.optional().default("" as BechAddr32),
  })
  .transform((val) => ({
    contractAddress: val.contract,
  }));
