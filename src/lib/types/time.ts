import { z } from "zod";

const zDateString = z.string().datetime({ offset: false });

export const zUtcDate = z
  .union([zDateString, z.preprocess((val) => `${val}Z`, zDateString)])
  .pipe(z.coerce.date());
