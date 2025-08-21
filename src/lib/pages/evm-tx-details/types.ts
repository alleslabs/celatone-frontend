import { zHex } from "lib/types";
import { z } from "zod";

export enum EvmEventBoxTabs {
  Decoded = "decoded",
  Formatted = "formatted",
  Raw = "raw",
}

export const zEvmTxDetailsQueryParams = z.object({
  txHash: zHex.length(66),
});
