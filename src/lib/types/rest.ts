import { z } from "zod";

export const zPagination = z.object({
  next_key: z.string().nullable(),
  total: z.coerce.number(),
});
export type Pagination = z.infer<typeof zPagination>;
