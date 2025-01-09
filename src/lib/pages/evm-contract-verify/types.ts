import { zHexAddr20 } from "lib/types";
import { z } from "zod";

export const zEvmContractVerifyQueryParams = z.object({
  contractAddress: zHexAddr20,
});
