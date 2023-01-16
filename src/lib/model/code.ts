import { useWallet } from "@cosmos-kit/react";

import { useContractStore } from "lib/hooks";
import {
  useCodeInfoByCodeId,
  useContractListByCodeId,
  useContractListCountByCodeId,
} from "lib/services/codeService";
import type { ContractInfo } from "lib/stores/contract";
import type { CodeData, ContractInstances, Option } from "lib/types";

export const useCodeData = (codeId: number): Option<CodeData> => {
  const { currentChainRecord } = useWallet();
  const { data: codeInfo } = useCodeInfoByCodeId(codeId);
  if (!currentChainRecord || !codeInfo) return undefined;

  return {
    chainId: currentChainRecord.chain.chain_id,
    ...codeInfo,
  } as CodeData;
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
  const { getContractInfo } = useContractStore();
  const data = contractList?.map((contract) => {
    const localContractInfo = getContractInfo(contract.contractAddress);
    return {
      ...localContractInfo,
      ...contract,
    } as ContractInfo;
  });
  return {
    contractList: data,
    count,
  };
};
