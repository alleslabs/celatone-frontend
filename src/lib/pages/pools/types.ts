import { z } from "zod";

import type { PoolTypeFilter } from "lib/types";

export interface PoolFilterState {
  keyword: string;
  poolTypeValue: PoolTypeFilter;
  isSuperfluidOnly: boolean;
}

export const zPoolDetailsQueryParams = z.object({
  poolId: z.coerce.number().positive(),
});
