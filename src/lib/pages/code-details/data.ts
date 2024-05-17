import type { UseQueryOptions } from "@tanstack/react-query";

import { useContractStore } from "lib/providers/store";
import type { ContractsResponse } from "lib/services/types";
import { useCodeLcd } from "lib/services/wasm/code";
import {
  useContractsByCodeId,
  useContractsByCodeIdLcd,
} from "lib/services/wasm/contract";
import type { ContractInfo, Option } from "lib/types";

export const useCodeDataLcd = (codeId: number, enabled: boolean) => {
  const { data, isLoading } = useCodeLcd(codeId, {
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
  options: Pick<UseQueryOptions<ContractsResponse>, "onSuccess"> = {}
) => {
  const { getContractLocalInfo } = useContractStore();
  const { data, isLoading } = useContractsByCodeId(
    codeId,
    limit,
    offset,
    options
  );

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

export const useCodeContractsLcd = (codeId: number) => {
  const { getContractLocalInfo } = useContractStore();
  const { data, ...rest } = useContractsByCodeIdLcd(codeId);

  return {
    data: data?.pages.flatMap((page) =>
      page.contracts.map<ContractInfo>((contract) => ({
        ...contract,
        ...getContractLocalInfo(contract.contractAddress),
      }))
    ),
    ...rest,
  };
};
