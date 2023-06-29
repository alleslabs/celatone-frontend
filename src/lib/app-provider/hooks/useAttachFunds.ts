import type { Coin } from "@cosmjs/stargate";
import { useCallback } from "react";

import { AttachFundsType } from "lib/components/fund/types";
import { useAssetInfos } from "lib/services/assetService";
import { fabricateFunds, sortDenoms } from "lib/utils";

export const useAttachFunds = () => {
  const { assetInfos } = useAssetInfos();

  return useCallback(
    (
      attachFundsOption: AttachFundsType,
      assetsJsonStr: string,
      assetsSelect: Coin[]
    ) => {
      const assetsSelectWithPrecision = assetsSelect.map((coin) => {
        return {
          ...coin,
          precision: assetInfos?.[coin.denom]?.precision,
        };
      });

      switch (attachFundsOption) {
        case AttachFundsType.ATTACH_FUNDS_SELECT:
          return fabricateFunds(assetsSelectWithPrecision);
        case AttachFundsType.ATTACH_FUNDS_JSON:
          try {
            if (JSON.parse(assetsJsonStr)) {
              return sortDenoms(JSON.parse(assetsJsonStr) as Coin[]);
            }
          } catch {
            return [];
          }
          return [];
        default:
          return [];
      }
    },
    [assetInfos]
  );
};
