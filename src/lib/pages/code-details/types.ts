import { z } from "zod";

export const zCodeDetailsQueryParams = z.object({
  codeId: z.coerce.number().positive(),
});
