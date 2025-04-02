import { isPosDecimal } from "lib/utils";
import { z } from "zod";

export const zBlockDetailQueryParams = z.object({
  height: z.string().refine(isPosDecimal).pipe(z.coerce.number()),
});
