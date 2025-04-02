import { snakeToCamel } from "lib/utils/formatter/snakeToCamel";
import { z } from "zod";

export const zPagination = z
  .object({
    next_key: z.string().nullable(),
    total: z.coerce.number(),
  })
  .transform(snakeToCamel);
export type Pagination = z.infer<typeof zPagination>;
