import { z } from "zod";
import { zHexAddr20 } from "lib/types";
import { isHex20Bytes } from "lib/utils";

// MARK - Query Params
export const zEvmContractVerifyQueryParams = z.object({
  contractAddress: z.preprocess((val) => {
    const address = String(val).trim();
    return isHex20Bytes(address) ? address : undefined;
  }, zHexAddr20.optional()),
});
