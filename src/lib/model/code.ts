import { useMemo } from "react";

import { useCurrentChain } from "lib/app-provider";
import type { PermissionFilterValue } from "lib/hooks";
import { useCodePermissionFilter, useCodeSearchFilter } from "lib/hooks";
import { useCodeStore } from "lib/providers/store";
import { useAllCodesByAddress, useCodeList } from "lib/services/wasm/code";
import type { BechAddr, CodeInfo } from "lib/types";
import { AccessConfigPermission } from "lib/types";

const useStoredCodes = () => {
  const { address } = useCurrentChain();
  const { getCodeLocalInfo, isCodeIdSaved, isHydrated } = useCodeStore();

  const { data: rawStoredCodes, isLoading } = useAllCodesByAddress(
    address as BechAddr
  );

  const storedCodes =
    rawStoredCodes?.items.map<CodeInfo>((code) => ({
      ...code,
      isSaved: isCodeIdSaved(code.id),
      name: getCodeLocalInfo(code.id)?.name,
    })) ?? [];

  return { isLoading: isLoading && isHydrated, storedCodes };
};

const useSavedCodes = () => {
  const { isHydrated, lastSavedCodeIds, lastSavedCodes } = useCodeStore();

  const savedCodeIds = lastSavedCodeIds();
  const { data: rawSavedCodes, isLoading } = useCodeList(savedCodeIds);

  const savedCodes = lastSavedCodes().map<CodeInfo>((localSavedCode) => {
    const rawSavedCode = rawSavedCodes?.items.find(
      (savedCode) => savedCode.id === localSavedCode.id
    );
    return {
      ...localSavedCode,
      contractCount: rawSavedCode?.contractCount,
      cw2Contract: rawSavedCode?.cw2Contract,
      cw2Version: rawSavedCode?.cw2Version,
      instantiatePermission:
        rawSavedCode?.instantiatePermission ?? AccessConfigPermission.UNKNOWN,
      isSaved: true,
      permissionAddresses: rawSavedCode?.permissionAddresses ?? [],
    };
  });

  return { isLoading: isLoading && isHydrated, savedCodes };
};

interface MyCodesData {
  allCodesCount: number;
  isSavedCodesLoading: boolean;
  isStoredCodesLoading: boolean;
  savedCodes: CodeInfo[];
  savedCodesCount: number;
  storedCodes: CodeInfo[];
  storedCodesCount: number;
}

export const useMyCodesData = (
  keyword: string,
  permissionValue: PermissionFilterValue
): MyCodesData => {
  const permissionFilterFn = useCodePermissionFilter(permissionValue);
  const searchFilterFn = useCodeSearchFilter(keyword);

  const { isLoading: isStoredCodesLoading, storedCodes } = useStoredCodes();
  const { isLoading: isSavedCodesLoading, savedCodes } = useSavedCodes();

  const [filteredSavedCodes, filteredStoredCodes] = useMemo(
    () => [
      savedCodes.filter(permissionFilterFn).filter(searchFilterFn),
      storedCodes.filter(permissionFilterFn).filter(searchFilterFn),
    ],
    [savedCodes, storedCodes, permissionFilterFn, searchFilterFn]
  );

  const storedCodesCount = storedCodes.length;
  const savedCodesCount = savedCodes.length;

  return {
    allCodesCount: storedCodesCount + savedCodesCount,
    isSavedCodesLoading,
    isStoredCodesLoading,
    savedCodes: filteredSavedCodes,
    savedCodesCount,
    storedCodes: filteredStoredCodes,
    storedCodesCount,
  };
};
