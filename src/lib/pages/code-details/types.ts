import { z } from "zod";

import { isId } from "lib/utils";

export const zCodeDetailsQueryParams = z.object({
  codeId: z.string().refine(
    (val) => {
      return isId(val);
    },
    {
      message: "Invalid code id",
    }
  ),
});
