import type { UseQueryOptions } from "@tanstack/react-query";

import { useContractStore } from "lib/providers/store";
import type { ContractsResponse } from "lib/services/types";
import { useContractsByCodeId } from "lib/services/wasm/contract";
import type { ContractInfo, Option } from "lib/types";

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
