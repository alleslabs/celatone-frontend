import type { Asset } from "@chain-registry/types";
import { useWallet } from "@cosmos-kit/react";
import { useCallback } from "react";

import type { SnakeToCamelCaseNested } from "lib/types";
import { snakeToCamel } from "lib/utils";

interface ChainRecordAsset extends Asset {
  precision: number;
}

type InternalChainRecordAsset = SnakeToCamelCaseNested<ChainRecordAsset>;

export const useChainRecordAsset = () => {
  const { currentChainRecord } = useWallet();

  return useCallback(
    (denom: string): InternalChainRecordAsset | null => {
      const assetInfo = currentChainRecord?.assetList.assets.find(
        (asset) => asset.base === denom
      );
      return assetInfo
        ? snakeToCamel({
            ...assetInfo,
            precision:
              assetInfo?.denom_units.find(
                (unit) =>
                  /**
                   * @remarks Might have to revisit this logic later. Edge case is when only uToken config is supplied (no token counterpart)
                   */
                  unit.denom ===
                  (denom[0] === "u" ? denom.slice(1) : "u".concat(denom))
              )?.exponent ?? 0,
          })
        : null;
    },
    [currentChainRecord]
  );
};
