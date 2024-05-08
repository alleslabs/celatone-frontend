import type { ZodType, ZodTypeDef } from "zod";

export const parseWithError = <T, S extends ZodTypeDef, U>(
  zod: ZodType<T, S, U>,
  data: unknown
): T => {
  try {
    return zod.parse(data);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Zod parsing error: ", e);
    throw e;
  }
};
