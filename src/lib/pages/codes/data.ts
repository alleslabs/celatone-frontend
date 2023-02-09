import { useWallet } from "@cosmos-kit/react";
import { useMemo } from "react";

import type { PermissionFilterValue } from "lib/hooks";
import {
  useUserKey,
  useCodeStore,
  usePermissionFilter,
  useSearchFilter,
} from "lib/hooks";
import {
  useCodeListByIDsQuery,
  useCodeListByUserQuery,
} from "lib/services/codeService";
import type { CodeInfo } from "lib/types";
import { InstantiatePermission } from "lib/types";

interface CodeListData {
  savedCodes: CodeInfo[];
  storedCodes: CodeInfo[];
  savedCodesCount: number;
  storedCodesCount: number;
  allCodesCount: number;
}

export const useCodeListData = (
  keyword?: string,
  permissionValue?: PermissionFilterValue
): CodeListData => {
  const { address } = useWallet();
  const { getCodeLocalInfo, lastSavedCodes, lastSavedCodeIds, isCodeIdSaved } =
    useCodeStore();

  const { data: rawStoredCodes = [] } = useCodeListByUserQuery(address);

  const userKey = useUserKey();
  const permissionFilterFn = usePermissionFilter(permissionValue);
  const searchFilterFn = useSearchFilter(keyword);

  const savedCodeIds = lastSavedCodeIds(userKey);
  const { data: querySavedCodeInfos = [] } =
    useCodeListByIDsQuery(savedCodeIds);

  const savedCodes = lastSavedCodes(userKey)?.map<CodeInfo>(
    (localSavedCode) => {
      const querySavedCodeInfo = querySavedCodeInfos.find(
        (savedCode) => savedCode.id === localSavedCode.id
      );
      return {
        ...localSavedCode,
        contracts: querySavedCodeInfo?.contracts ?? 0,
        instantiatePermission:
          querySavedCodeInfo?.instantiatePermission ??
          InstantiatePermission.UNKNOWN,
        permissionAddresses: querySavedCodeInfo?.permissionAddresses ?? [],
        isSaved: true,
      };
    }
  );

  const savedCodesCount = savedCodes?.length ?? 0;

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
  };
};
