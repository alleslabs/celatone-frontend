import { z } from "zod";

import type { PoolTypeFilter } from "lib/types";

export interface PoolFilterState {
  isSuperfluidOnly: boolean;
  keyword: string;
  poolTypeValue: PoolTypeFilter;
}

export const zPoolDetailsQueryParams = z.object({
  poolId: z.coerce.number().positive(),
});
