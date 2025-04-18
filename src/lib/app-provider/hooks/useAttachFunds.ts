import type { Coin } from "@cosmjs/stargate";

import { AttachFundsType } from "lib/components/fund/types";
import { useAssetInfos } from "lib/services/assetService";
import { fabricateFunds, sortDenoms } from "lib/utils";
import { useCallback } from "react";

export const useAttachFunds = () => {
  const { data: assetInfos } = useAssetInfos({ withPrices: false });

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
            return sortDenoms(JSON.parse(assetsJsonStr));
          } catch {
            return [];
          }
        default:
          return [];
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(assetInfos)]
  );
};
