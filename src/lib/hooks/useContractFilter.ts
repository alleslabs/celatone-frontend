import { useCallback } from "react";

import type { ContractInfo } from "lib/types";

export const useContractSearchFilter = (keyword: string) =>
  useCallback(
    (contract: ContractInfo) => {
      const computedKeyword = keyword.trim();
      if (!computedKeyword.length) return true;
      return (
        contract.contractAddress.startsWith(computedKeyword) ||
        contract.name?.toLowerCase().includes(computedKeyword.toLowerCase()) ||
        contract.label.toLowerCase().includes(computedKeyword.toLowerCase())
      );
    },
    [keyword]
  );
