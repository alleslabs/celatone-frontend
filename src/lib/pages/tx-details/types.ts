import { z } from "zod";

import { zTxHash } from "lib/types";

export const zTxDetailsQueryParams = z.object({
  txHash: zTxHash,
});
