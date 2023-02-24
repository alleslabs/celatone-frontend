import Big from "big.js";
import { useMemo } from "react";

import type { BalanceWithAssetInfo, USD, Option } from "lib/types";
import { calAssetValueWithPrecision } from "lib/utils";

export const useTotalValue = (
  assets: Option<BalanceWithAssetInfo[]>
): Option<USD<Big>> =>
  useMemo(() => {
    return assets?.reduce((acc: USD<Big>, curr: BalanceWithAssetInfo) => {
      return acc.add(calAssetValueWithPrecision(curr.balance)) as USD<Big>;
    }, Big(0) as USD<Big>);
  }, [assets]);
