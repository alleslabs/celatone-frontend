import { zHex, zTxHash } from "lib/types";
import { z } from "zod";

export const zTxDetailsQueryParams = (evmEnabled: boolean) =>
  z.object({
    txHash: evmEnabled ? zTxHash.or(zHex.length(66)) : zTxHash,
  });
