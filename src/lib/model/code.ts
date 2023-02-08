import { useWallet } from "@cosmos-kit/react";

import { useContractStore } from "lib/hooks";
import {
  useCodeInfoByCodeId,
  useContractListByCodeId,
  useContractListCountByCodeId,
} from "lib/services/codeService";
import { usePublicProjectByCodeId } from "lib/services/publicProjectService";
import type { ContractLocalInfo } from "lib/stores/contract";
import type {
  CodeData,
  ContractInstances,
  Option,
  PublicCodeData,
} from "lib/types";

interface CodeDataState {
  isLoading: boolean;
  codeData: CodeData;
  publicCodeData: Option<PublicCodeData>;
}

export const useCodeData = (codeId: number): Option<CodeDataState> => {
  const { currentChainRecord } = useWallet();
  const { data: codeInfo, isLoading } = useCodeInfoByCodeId(codeId);
  const { data: publicCodeInfo } = usePublicProjectByCodeId(codeId);
  if (!currentChainRecord || (!codeInfo && !isLoading)) return undefined;

  return {
    isLoading,
    codeData: {
      chainId: currentChainRecord.chain.chain_id,
      ...codeInfo,
    } as CodeData,
    publicCodeData: publicCodeInfo,
  };
};

export const useCodeContractInstances = (
  codeId: number,
  offset: number,
  pageSize: number
): Option<ContractInstances> => {
  const { data: contractList } = useContractListByCodeId(
    codeId,
    offset,
    pageSize
  );
  const { data: count = 0 } = useContractListCountByCodeId(codeId);
  const { getContractLocalInfo } = useContractStore();
  const data = contractList?.map((contract) => {
    const contractLocalInfo = getContractLocalInfo(contract.contractAddress);
    return {
      ...contractLocalInfo,
      ...contract,
    } as ContractLocalInfo;
  });
  return {
    contractList: data,
    count,
  };
};
