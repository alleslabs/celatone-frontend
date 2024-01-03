import { z } from "zod";

import { zHexAddr } from "lib/types";

export const zNFTDetailQueryParams = z.object({
  collectionAddress: zHexAddr,
  nftAddress: zHexAddr,
});
