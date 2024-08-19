import { z } from "zod";

import { zBechAddr32 } from "lib/types";

export const zUpdateAdminQueryParams = z.object({
  contractAddress: zBechAddr32,
});
