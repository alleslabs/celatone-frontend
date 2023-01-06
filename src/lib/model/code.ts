import { useWallet } from "@cosmos-kit/react";

import { useCodeInfoByCodeId } from "lib/services/codeService";
import type { CodeInfoInCodeDetail } from "lib/types";

export interface CodeDetail {
  chainId: string | undefined;
  codeInfo: CodeInfoInCodeDetail | undefined;
}

export const useCodeDetail = (codeId: number): CodeDetail | undefined => {
  const { currentChainRecord } = useWallet();
  const { data: codeInfo } = useCodeInfoByCodeId(codeId);
  if (!currentChainRecord) return undefined;

  return {
    chainId: currentChainRecord.chain.chain_id,
    codeInfo,
  };
};
