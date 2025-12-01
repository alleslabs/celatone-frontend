import { zPagination } from "lib/types";
import { z } from "zod";

const zTokenHolder = z.object({
  account: z.string(),
  amount: z.string(),
});

export const zRichlistResponseSequencer = z.object({
  holders: z.array(zTokenHolder),
  pagination: zPagination,
});

export type RichlistResponseSequencer = z.infer<
  typeof zRichlistResponseSequencer
>;
export type TokenHolder = z.infer<typeof zTokenHolder>;
