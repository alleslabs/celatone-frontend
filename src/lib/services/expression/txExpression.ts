import { useMemo } from "react";

import type { Option, PoolTxFilter } from "lib/types";

export const usePoolTxExpression = (
  poolId: Option<number>,
  type: PoolTxFilter
) =>
  useMemo(
    () => ({
      ...(poolId ? { pool_id: { _eq: poolId } } : {}),
      ...(type !== "is_all" ? { [type]: { _eq: true } } : {}),
    }),
    [poolId, type]
  );
