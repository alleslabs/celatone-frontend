import { z } from "zod";

// TODO: make it right when we use Any interface
export const zAny = z.object({
  typeUrl: z.string(),
  value: z.array(z.number()), // UInt8Array
});
