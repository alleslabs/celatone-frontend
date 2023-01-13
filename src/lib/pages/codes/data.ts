import { useWallet } from "@cosmos-kit/react";
import { useMemo } from "react";

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

export const useCodeListData = (keyword?: string): CodeListData => {
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

  const [filteredSavedCodes, filteredStoredCodes] = useMemo(() => {
    const filterFn = (code: CodeInfo) => {
      if (keyword === undefined) return true;

      const computedKeyword = keyword.trim();
      if (computedKeyword.length === 0) return true;

      return (
        code.id.toString().startsWith(computedKeyword) ||
        code.description?.toLowerCase().includes(computedKeyword.toLowerCase())
      );
    };

    return [savedCodes.filter(filterFn), storedCodes.filter(filterFn)];
  }, [keyword, savedCodes, storedCodes]);

  return {
    savedCodes: filteredSavedCodes,
    storedCodes: filteredStoredCodes,
    savedCodesCount,
    storedCodesCount,
    allCodesCount: storedCodesCount + savedCodesCount,
  };
};
