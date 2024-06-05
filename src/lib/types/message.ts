import { z } from "zod";

export const zMessageResponse = z
  .object({
    "@type": z.string(),
  })
  .passthrough();
export type MessageResponse = z.infer<typeof zMessageResponse>;
