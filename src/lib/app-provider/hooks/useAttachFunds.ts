import type { Coin } from "@cosmjs/stargate";
import { useCallback } from "react";

import { AttachFundsType } from "lib/components/fund/types";
import { fabricateFunds, sortDenoms } from "lib/utils";

import { useChainRecordAsset } from "./useChainRecordAsset";

export const useAttachFunds = () => {
  const getAssetInfo = useChainRecordAsset();

  return useCallback(
    (
      attachFundsOption: AttachFundsType,
      assetsJsonStr: string,
      assetsSelect: Coin[]
    ) => {
      const assetsSelectWithPrecision = assetsSelect.map((coin) => {
        return {
          ...coin,
          precision: getAssetInfo(coin.denom)?.precision,
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
    [getAssetInfo]
  );
};
