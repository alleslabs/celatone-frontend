import { zHex } from "lib/types";
import { z } from "zod";

export enum EvmEventBoxTabs {
  Decoded = "decoded",
  Hex = "hex",
}

export const zEvmTxDetailsQueryParams = z.object({
  txHash: zHex.length(66),
});
