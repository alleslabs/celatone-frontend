import { useMemo } from "react";

import type { PermissionFilterValue } from "lib/hooks";
import { usePermissionFilter, useSearchFilter } from "lib/hooks";
import { useCodeStore } from "lib/providers/store";
import { useCodeListQuery } from "lib/services/codeService";
import type { CodeInfo } from "lib/types";

interface RecentCodesData {
  recentCodes: CodeInfo[];
  isLoading: boolean;
}

export const useRecentCodesData = (
  keyword: string,
  permissionValue: PermissionFilterValue
): RecentCodesData => {
  const { getCodeLocalInfo, isCodeIdSaved } = useCodeStore();
  const { data: rawRecentCodes = [], isLoading } = useCodeListQuery();
  const permissionFilterFn = usePermissionFilter(permissionValue);
  const searchFilterFn = useSearchFilter(keyword);

  const recentCodes = rawRecentCodes.map<CodeInfo>((code) => ({
    ...code,
    name: getCodeLocalInfo(code.id)?.name,
    isSaved: isCodeIdSaved(code.id),
  }));

  return useMemo(() => {
    return {
      recentCodes: recentCodes
        .filter(permissionFilterFn)
        .filter(searchFilterFn),
      isLoading,
    };
  }, [recentCodes, isLoading, permissionFilterFn, searchFilterFn]);
};
