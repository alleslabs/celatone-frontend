import { z } from "zod";

import { zHexAddr } from "lib/types";

export const zNftDetailQueryParams = z.object({
  collectionAddress: zHexAddr,
  nftAddress: zHexAddr,
});
