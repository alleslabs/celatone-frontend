import type { BechAddr20, CodeInfo, Option } from "lib/types";

import { type PermissionFilterValue, useQueryEvents } from "lib/hooks";
import { useCodeStore } from "lib/providers/store";
import { useCodes, useCodesRest } from "lib/services/wasm/code";

export const useRecentCodes = (
  pageSize: number,
  offset: number,
  address: Option<BechAddr20>,
  permissionValue: PermissionFilterValue,
  setTotalData: (totalData: number) => void
) => {
  const { getCodeLocalInfo, isCodeIdSaved } = useCodeStore();
  const codesQuery = useCodes(
    pageSize,
    offset,
    address,
    permissionValue === "all"
      ? undefined
      : permissionValue === "without-proposal"
  );
  useQueryEvents(codesQuery, {
    onSuccess: (data) => setTotalData(data.total),
  });
  const { data: codes, isLoading } = codesQuery;

  if (!codes) return { data: undefined, isLoading };
  return {
    data: {
      items: codes.items.map<CodeInfo>((code) => ({
        ...code,
        isSaved: isCodeIdSaved(code.id),
        name: getCodeLocalInfo(code.id)?.name,
      })),
      total: codes.total,
    },
    isLoading,
  };
};

export const useRecentCodesRest = () => {
  const { getCodeLocalInfo, isCodeIdSaved } = useCodeStore();
  const { data, ...rest } = useCodesRest();

  return {
    data: data?.pages.flatMap((page) =>
      page.code_infos.map<CodeInfo>((code) => ({
        ...code,
        isSaved: isCodeIdSaved(code.id),
        name: getCodeLocalInfo(code.id)?.name,
      }))
    ),
    ...rest,
  };
};
