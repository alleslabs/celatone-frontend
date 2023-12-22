import { z } from "zod";

export const zPagination = z.object({
  next_key: z.string().optional(),
  total: z.number(),
});
export type Pagination = z.infer<typeof zPagination>;
