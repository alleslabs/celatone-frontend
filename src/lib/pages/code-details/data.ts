import type { ContractInfo, Option } from "lib/types";

import { useQueryEvents } from "lib/hooks/useQueryEvents";
import { useContractStore } from "lib/providers/store";
import { useCodeRest } from "lib/services/wasm/code";
import {
  useContractsByCodeId,
  useContractsByCodeIdRest,
} from "lib/services/wasm/contract";

export const useCodeDataRest = (codeId: number, enabled: boolean) => {
  const { data, isLoading } = useCodeRest(codeId, {
    enabled,
  });

  return {
    data: data
      ? {
          info: data,
          projectInfo: null,
          publicInfo: null,
        }
      : undefined,
    isLoading,
  };
};

export const useCodeContracts = (
  codeId: number,
  limit: number,
  offset: number,
  onSuccess: (data: number) => void
) => {
  const { getContractLocalInfo } = useContractStore();
  const contractsByCodeIdQuery = useContractsByCodeId(codeId, limit, offset);
  useQueryEvents(contractsByCodeIdQuery, {
    onSuccess: ({ total }) => onSuccess(total),
  });
  const { data, isLoading } = contractsByCodeIdQuery;

  const contracts: Option<ContractInfo[]> = data?.items?.map<ContractInfo>(
    (contract) => ({
      ...contract,
      ...getContractLocalInfo(contract.contractAddress),
    })
  );

  return {
    data: {
      ...data,
      items: contracts,
    },
    isLoading,
  };
};

export const useCodeContractsRest = (codeId: number) => {
  const { getContractLocalInfo } = useContractStore();
  const { data, ...rest } = useContractsByCodeIdRest(codeId);

  return {
    data: data?.pages.flatMap((page) =>
      page.contracts.map<ContractInfo>((contract) => ({
        ...contract,
        ...getContractLocalInfo(contract.contractAddress),
        codeId,
      }))
    ),
    ...rest,
  };
};
