import { z } from "zod";

export const zCodeDetailsQueryParams = z.object({
  codeId: z.string().refine(
    (val) => {
      const code = Number(val);
      const isInteger = Number.isInteger(code);

      return isInteger && code > 0;
    },
    {
      message: "Invalid code id",
    }
  ),
});
