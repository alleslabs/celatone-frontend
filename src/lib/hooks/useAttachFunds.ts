import type { Coin } from "@cosmjs/stargate";
import { useCallback } from "react";

import { AttachFundsType } from "lib/types";
import { fabricateFunds } from "lib/utils";

interface AttachFundsParams {
  attachFundOption: AttachFundsType;
  assetsJson: string;
  assetsSelect: Coin[];
}

export const useAttachFunds = ({
  attachFundOption,
  assetsJson,
  assetsSelect,
}: AttachFundsParams) => {
  return useCallback(() => {
    if (attachFundOption === AttachFundsType.ATTACH_FUNDS_SELECT) {
      return fabricateFunds(assetsSelect);
    }
    if (attachFundOption === AttachFundsType.ATTACH_FUNDS_JSON) {
      try {
        if (JSON.parse(assetsJson)) {
          return JSON.parse(assetsJson) as Coin[];
        }
      } catch {
        // comment just to avoid eslint no-empty
      }
    }

    return [];
  }, [assetsJson, assetsSelect, attachFundOption]);
};
