import { snakeToCamel } from "lib/utils/formatter/snakeToCamel";
import { z } from "zod";

export const zPagination = z
  .object({
    next_key: z.string().nullable(),
    total: z.coerce.number().transform((val) => (val < 0 ? 0 : val)),
  })
  .transform(snakeToCamel);
export type Pagination = z.infer<typeof zPagination>;
