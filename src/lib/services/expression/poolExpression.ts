import { useMemo } from "react";

import type { PoolTypeFilter } from "lib/types";
import { isPositiveInt } from "lib/utils";

export const usePoolExpression = (
  isSupported: boolean,
  poolType: PoolTypeFilter,
  isSuperfluidOnly: boolean,
  search: string
) =>
  useMemo(
    () => ({
      is_supported: { _eq: isSupported },
      type: poolType !== "All" ? { _eq: `${poolType}` } : {},
      is_superfluid: isSuperfluidOnly ? { _eq: true } : {},
      id: isPositiveInt(search) ? { _eq: Number(search) } : {},
    }),
    [isSuperfluidOnly, isSupported, poolType, search]
  );
