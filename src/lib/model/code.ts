import { useChainId, useContractStore } from "lib/hooks";
import { useCodeInfoByCodeId } from "lib/services/codeService";
import {
  useContractListByCodeIdPagination,
  useContractListCountByCodeId,
} from "lib/services/contractService";
import {
  usePublicProjectByCodeId,
  usePublicProjectBySlug,
} from "lib/services/publicProjectService";
import type { ContractLocalInfo } from "lib/stores/contract";
import type {
  CodeData,
  ContractInstances,
  PublicDetail,
  Option,
  PublicCodeData,
} from "lib/types";

export interface CodeDataState {
  isLoading: boolean;
  chainId: string;
  codeData: Option<CodeData>;
  publicProject: {
    publicCodeData: Option<PublicCodeData>;
    publicDetail: Option<PublicDetail>;
  };
}

export const useCodeData = (codeId: number): CodeDataState => {
  const { data: codeInfo, isLoading } = useCodeInfoByCodeId(codeId);
  const { data: publicCodeInfo } = usePublicProjectByCodeId(codeId);
  const { data: publicInfoBySlug } = usePublicProjectBySlug(
    publicCodeInfo?.slug
  );

  const chainId = useChainId();

  return {
    isLoading,
    chainId,
    codeData: codeInfo as CodeData,
    publicProject: {
      publicCodeData: publicCodeInfo,
      publicDetail: publicInfoBySlug?.details,
    },
  };
};

export const useCodeContractInstances = (
  codeId: number,
  offset: number,
  pageSize: number
): ContractInstances => {
  const { data: contractList } = useContractListByCodeIdPagination(
    codeId,
    offset,
    pageSize
  );
  const { data: count } = useContractListCountByCodeId(codeId);
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
