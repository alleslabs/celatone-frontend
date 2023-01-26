import { useMemo } from "react";

import { usePermissionFilter, useSearchFilter } from "lib/app-fns/filter";
import { useCodeStore } from "lib/hooks";
import { useCodeListQuery } from "lib/services/codeService";
import type { CodeInfo } from "lib/types";

interface AllCodesData {
  allCodes: CodeInfo[];
  isLoading: boolean;
}

export const useAllCodesData = (
  permissionValue: string,
  keyword?: string
): AllCodesData => {
  const { getCodeLocalInfo, isCodeIdSaved } = useCodeStore();
  const { data: rawAllCodes = [], isLoading } = useCodeListQuery();

  const allCodes = rawAllCodes.map<CodeInfo>((code) => ({
    ...code,
    description: getCodeLocalInfo(code.id)?.description,
    isSaved: isCodeIdSaved(code.id),
  }));
  const permissionFilter = usePermissionFilter(permissionValue);
  const searchFilter = useSearchFilter(keyword);
  return useMemo(() => {
    return {
      allCodes: allCodes.filter(permissionFilter).filter(searchFilter),
      isLoading,
    };
  }, [allCodes, permissionFilter, searchFilter, isLoading]);
};
