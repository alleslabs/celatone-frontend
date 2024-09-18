import { z } from "zod";

import { zHex, zTxHash } from "lib/types";

export const zTxDetailsQueryParams = (evmEnabled: boolean) =>
  z.object({
    txHash: evmEnabled ? zTxHash.or(zHex.length(66)) : zTxHash,
  });
