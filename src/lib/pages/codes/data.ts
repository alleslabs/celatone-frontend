import { useWallet } from "@cosmos-kit/react";
import { useMemo } from "react";

import { usePermissionFilter, useSearchFilter } from "lib/app-fns/filter";
import { useUserKey, useCodeStore } from "lib/hooks";
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
  permissionValue?: string
): CodeListData => {
  const { address } = useWallet();
  const { getCodeLocalInfo, lastSavedCodes, lastSavedCodeIds, isCodeIdSaved } =
    useCodeStore();

  const { data: rawStoredCodes = [] } = useCodeListByUserQuery(address);

  const userKey = useUserKey();

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
      description: getCodeLocalInfo(code.id)?.description,
      isSaved: isCodeIdSaved(code.id),
    };
  });

  const storedCodesCount = storedCodes.length;

  const permissionFilter = usePermissionFilter(permissionValue);
  const searchFilter = useSearchFilter(keyword);
  const [filteredSavedCodes, filteredStoredCodes] = useMemo(() => {
    return [
      savedCodes.filter(permissionFilter).filter(searchFilter),
      storedCodes.filter(permissionFilter).filter(searchFilter),
    ];
  }, [savedCodes, permissionFilter, searchFilter, storedCodes]);

  return {
    savedCodes: filteredSavedCodes,
    storedCodes: filteredStoredCodes,
    savedCodesCount,
    storedCodesCount,
    allCodesCount: storedCodesCount + savedCodesCount,
  };
};
