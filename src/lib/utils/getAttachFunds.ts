import type { Coin } from "@cosmjs/stargate";

import { AttachFundsType } from "lib/components/fund/types";

import { fabricateFunds, sortDenoms } from "./funds";

interface AttachFundsParams {
  attachFundsOption: AttachFundsType;
  assetsJsonStr: string;
  assetsSelect: Coin[];
}

export const getAttachFunds = ({
  attachFundsOption,
  assetsJsonStr,
  assetsSelect,
}: AttachFundsParams) => {
  switch (attachFundsOption) {
    case AttachFundsType.ATTACH_FUNDS_SELECT:
      return fabricateFunds(assetsSelect);
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
};
