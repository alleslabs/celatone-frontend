import { useWallet } from "@cosmos-kit/react";
import { useMemo } from "react";

import type { PermissionFilterValue } from "lib/hooks";
import {
  useUserKey,
  useCodeStore,
  usePermissionFilter,
  useSearchFilter,
} from "lib/hooks";
import { useCodeListPageQuery } from "lib/services/codeService";
import type { CodeInfo, HumanAddr } from "lib/types";
import { InstantiatePermission } from "lib/types";

interface CodeListData {
  savedCodes: CodeInfo[];
  storedCodes: CodeInfo[];
  savedCodesCount: number;
  storedCodesCount: number;
  allCodesCount: number;
  isStoredCodesLoading: boolean;
  isSavedCodesLoading: boolean;
}

export const useCodeListData = (
  keyword?: string,
  permissionValue?: PermissionFilterValue
): CodeListData => {
  const { address } = useWallet();
  const userKey = useUserKey();
  const { getCodeLocalInfo, lastSavedCodes, lastSavedCodeIds, isCodeIdSaved } =
    useCodeStore();

  const permissionFilterFn = usePermissionFilter(permissionValue);
  const searchFilterFn = useSearchFilter(keyword);

  const savedCodeIds = lastSavedCodeIds(userKey);

  const [
    { data: rawStoredCodes = [], isLoading: isStoredCodesLoading },
    { data: querySavedCodeInfos = [], isLoading: isSavedCodesLoading },
  ] = useCodeListPageQuery({
    walletAddr: address as HumanAddr,
    ids: savedCodeIds,
  });

  const savedCodes = lastSavedCodes(userKey)?.map<CodeInfo>(
    (localSavedCode) => {
      const querySavedCodeInfo = querySavedCodeInfos.find(
        (savedCode) => savedCode.id === localSavedCode.id
      );
      return {
        ...localSavedCode,
        contractCount: querySavedCodeInfo?.contractCount,
        instantiatePermission:
          querySavedCodeInfo?.instantiatePermission ??
          InstantiatePermission.UNKNOWN,
        permissionAddresses: querySavedCodeInfo?.permissionAddresses ?? [],
        isSaved: true,
      };
    }
  );

  const savedCodesCount = savedCodes.length;

  const storedCodes = rawStoredCodes.map<CodeInfo>((code) => {
    return {
      ...code,
      name: getCodeLocalInfo(code.id)?.name,
      isSaved: isCodeIdSaved(code.id),
    };
  });

  const storedCodesCount = storedCodes.length;

  const [filteredSavedCodes, filteredStoredCodes] = useMemo(() => {
    return [
      savedCodes.filter(permissionFilterFn).filter(searchFilterFn),
      storedCodes.filter(permissionFilterFn).filter(searchFilterFn),
    ];
  }, [savedCodes, storedCodes, permissionFilterFn, searchFilterFn]);

  return {
    savedCodes: filteredSavedCodes,
    storedCodes: filteredStoredCodes,
    savedCodesCount,
    storedCodesCount,
    allCodesCount: storedCodesCount + savedCodesCount,
    isStoredCodesLoading,
    isSavedCodesLoading,
  };
};
