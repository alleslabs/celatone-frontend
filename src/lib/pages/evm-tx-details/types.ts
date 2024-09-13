import { z } from "zod";

import { zHex } from "lib/types";

export const zEvmTxDetailsQueryParams = z.object({
  txHash: zHex.length(66),
});
