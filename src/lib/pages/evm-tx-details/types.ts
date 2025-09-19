import { zHex } from "lib/types";
import { z } from "zod";

export const zEvmTxDetailsQueryParams = z.object({
  txHash: zHex.length(66),
});
