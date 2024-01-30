import type { PermissionFilterValue } from "lib/hooks";
import { useCodeStore } from "lib/providers/store";
import { useCodes } from "lib/services/codeService";
import type { BechAddr20, CodeInfo, Option } from "lib/types";

export const useRecentCodes = (
  pageSize: number,
  offset: number,
  address: Option<BechAddr20>,
  permissionValue: PermissionFilterValue,
  setTotalData: (totalData: number) => void
) => {
  const { getCodeLocalInfo, isCodeIdSaved } = useCodeStore();
  const { data: codes, isLoading } = useCodes(
    pageSize,
    offset,
    address,
    permissionValue === "all"
      ? undefined
      : permissionValue === "without-proposal",
    {
      onSuccess: (data) => setTotalData(data.total),
    }
  );

  if (!codes) return { data: undefined, isLoading };
  return {
    data: {
      items: codes.items.map<CodeInfo>((code) => ({
        ...code,
        name: getCodeLocalInfo(code.id)?.name,
        isSaved: isCodeIdSaved(code.id),
      })),
      total: codes.total,
    },
    isLoading,
  };
};
