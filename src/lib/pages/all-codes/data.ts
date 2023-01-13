import { useMemo } from "react";

import { useCodeStore } from "lib/hooks";
import { useCodeListQuery } from "lib/services/codeService";
import type { CodeInfo } from "lib/types";

interface AllCodesData {
  allCodes: CodeInfo[];
  isLoading: boolean;
}

export const useAllCodesData = (keyword?: string): AllCodesData => {
  const { getCodeLocalInfo, isCodeIdSaved } = useCodeStore();
  const { data: rawAllCodes = [], isLoading } = useCodeListQuery();

  const allCodes = rawAllCodes.map<CodeInfo>((code) => ({
    ...code,
    description: getCodeLocalInfo(code.id)?.description,
    isSaved: isCodeIdSaved(code.id),
  }));

  return useMemo(() => {
    const filterFn = (code: CodeInfo) => {
      if (keyword === undefined) return true;

      const computedKeyword = keyword.trim();
      if (computedKeyword.length === 0) return true;

      return (
        code.id.toString().startsWith(computedKeyword) ||
        code.description?.toLowerCase().includes(computedKeyword.toLowerCase())
      );
    };

    return { allCodes: allCodes.filter(filterFn), isLoading };
  }, [keyword, allCodes, isLoading]);
};
