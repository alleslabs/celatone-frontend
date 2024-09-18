import { z } from "zod";

export const zContractByListQueryParams = z.object({
  slug: z.string(),
});
