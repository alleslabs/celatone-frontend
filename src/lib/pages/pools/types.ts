import type { PoolTypeFilter } from "lib/types";

import { z } from "zod";

export interface PoolFilterState {
  isSuperfluidOnly: boolean;
  keyword: string;
  poolTypeValue: PoolTypeFilter;
}

export const zPoolDetailsQueryParams = z.object({
  poolId: z.coerce.number().positive(),
});
