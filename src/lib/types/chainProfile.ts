import { z } from "zod";

export const zChainProfile = z.object({
  l2: z.boolean(),
  pretty_name: z.string(),
  social: z.object({
    twitter: z.string(),
    website: z.string(),
  }),
});
export type ChainProfile = z.infer<typeof zChainProfile>;
