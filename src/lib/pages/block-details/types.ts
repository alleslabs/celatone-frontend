import { z } from "zod";

import { isPosDecimal } from "lib/utils";

export const zBlockDetailQueryParams = z.object({
  height: z.string().refine(isPosDecimal).pipe(z.coerce.number()),
});
