import { zHexAddr20 } from "lib/types";
import { isHex20Bytes } from "lib/utils";
import { z } from "zod";

// MARK - Query Params
export const zEvmContractVerifyQueryParams = z.object({
  contractAddress: z.preprocess((val) => {
    const address = String(val).trim();
    return isHex20Bytes(address) ? address : undefined;
  }, zHexAddr20.optional()),
});
