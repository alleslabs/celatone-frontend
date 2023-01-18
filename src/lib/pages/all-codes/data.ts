import { useWallet } from "@cosmos-kit/react";
import { useMemo } from "react";

import { useCodeStore } from "lib/hooks";
import { useCodeListQuery } from "lib/services/codeService";
import type { CodeInfo, HumanAddr } from "lib/types";
import { InstantiatePermission } from "lib/types";

interface AllCodesData {
  allCodes: CodeInfo[];
  isLoading: boolean;
}

export const useAllCodesData = (
  keyword: string,
  permissionValue: string
): AllCodesData => {
  const { getCodeLocalInfo, isCodeIdSaved } = useCodeStore();
  const { data: rawAllCodes = [], isLoading } = useCodeListQuery();

  const allCodes = rawAllCodes.map<CodeInfo>((code) => ({
    ...code,
    description: getCodeLocalInfo(code.id)?.description,
    isSaved: isCodeIdSaved(code.id),
  }));
  const { address } = useWallet();

  return useMemo(() => {
    const permissionFilter = (code: CodeInfo) => {
      const isEveryBody =
        code.instantiatePermission === InstantiatePermission.EVERYBODY;
      const isNobody =
        code.instantiatePermission === InstantiatePermission.NOBODY;
      const isInclude = code.permissionAddresses.includes(address as HumanAddr);

      switch (permissionValue) {
        case "with-proposal":
          return (!isEveryBody && !isInclude) || isNobody;
        case "without-proposal":
          return isInclude || isEveryBody;
        case "all":
        default:
          return true;
      }
    };

    const searchFilter = (code: CodeInfo) => {
      const computedKeyword = keyword.trim();
      if (computedKeyword.length === 0) return true;

      return (
        code.id.toString().startsWith(computedKeyword) ||
        code.description?.toLowerCase().includes(computedKeyword.toLowerCase())
      );
    };

    return {
      allCodes: allCodes.filter(permissionFilter).filter(searchFilter),
      isLoading,
    };
  }, [keyword, allCodes, isLoading, permissionValue, address]);
};
