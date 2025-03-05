import { z } from "zod";

import { zHex } from "lib/types";

export enum EvmEventBoxTabs {
  Decoded = "decoded",
  Hex = "hex",
}

export const zEvmTxDetailsQueryParams = z.object({
  txHash: zHex.length(66),
});
