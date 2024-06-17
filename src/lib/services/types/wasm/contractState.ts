import { z } from "zod";

import { zPagination } from "lib/types";

export const zResponseContractState = z.object({
  key: z.string(),
  value: z.string(),
});

export const zResponseContractStates = z.object({
  models: zResponseContractState.array(),
  pagination: zPagination,
});
