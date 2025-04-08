import type { PoolTypeFilter } from "lib/types";

import { z } from "zod";

export interface PoolFilterState {
  keyword: string;
  poolTypeValue: PoolTypeFilter;
  isSuperfluidOnly: boolean;
}

export const zPoolDetailsQueryParams = z.object({
  poolId: z.coerce.number().positive(),
});
