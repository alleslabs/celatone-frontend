import { useMemo } from "react";

import type { PermissionFilterValue } from "lib/hooks";
import { useCodeStore, usePermissionFilter, useSearchFilter } from "lib/hooks";
import { useCodeListQuery } from "lib/services/codeService";
import type { CodeInfo } from "lib/types";

interface AllCodesData {
  allCodes: CodeInfo[];
  isLoading: boolean;
}

export const useAllCodesData = (
  keyword: string,
  permissionValue: PermissionFilterValue
): AllCodesData => {
  const { getCodeLocalInfo, isCodeIdSaved } = useCodeStore();
  const { data: rawAllCodes = [], isLoading } = useCodeListQuery();
  const permissionFilterFn = usePermissionFilter(permissionValue);
  const searchFilterFn = useSearchFilter(keyword);

  const allCodes = rawAllCodes.map<CodeInfo>((code) => ({
    ...code,
    description: getCodeLocalInfo(code.id)?.description,
    isSaved: isCodeIdSaved(code.id),
  }));

  return useMemo(() => {
    return {
      allCodes: allCodes.filter(permissionFilterFn).filter(searchFilterFn),
      isLoading,
    };
  }, [allCodes, isLoading, permissionFilterFn, searchFilterFn]);
};
