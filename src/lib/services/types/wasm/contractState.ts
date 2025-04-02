import { zPagination } from "lib/types";
import { z } from "zod";

export const zResponseContractState = z.object({
  key: z.string(),
  value: z.string(),
});

export const zResponseContractStates = z.object({
  models: zResponseContractState.array(),
  pagination: zPagination,
});
