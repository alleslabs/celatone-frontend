import type { Coin } from "@cosmjs/stargate";

import { AttachFundsType } from "lib/components/fund/types";

import { fabricateFunds } from "./funds";

interface AttachFundsParams {
  attachFundOption: AttachFundsType;
  assetsJson: string;
  assetsSelect: Coin[];
}

export const getAttachFunds = ({
  attachFundOption,
  assetsJson,
  assetsSelect,
}: AttachFundsParams) => {
  switch (attachFundOption) {
    case AttachFundsType.ATTACH_FUNDS_SELECT:
      return fabricateFunds(assetsSelect);
    case AttachFundsType.ATTACH_FUNDS_JSON:
      try {
        if (JSON.parse(assetsJson)) {
          return JSON.parse(assetsJson) as Coin[];
        }
      } catch {
        // comment just to avoid eslint no-empty
      }
      return [];
    default:
      return [];
  }
};
