import { useWallet } from "@cosmos-kit/react";

import { useContractStore } from "lib/hooks";
import {
  useCodeInfoByCodeId,
  useContractListByCodeId,
  useContractListCountByCodeId,
} from "lib/services/codeService";
import type { ContractLocalInfo } from "lib/stores/contract";
import type { CodeDetails, ContractInstances, Option } from "lib/types";

export const useCodeData = (codeId: number): Option<CodeDetails> => {
  const { currentChainRecord } = useWallet();
  const { data: codeInfo } = useCodeInfoByCodeId(codeId);
  if (!currentChainRecord || !codeInfo) return undefined;

  return {
    chainId: currentChainRecord.chain.chain_id,
    ...codeInfo,
  } as CodeDetails;
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
