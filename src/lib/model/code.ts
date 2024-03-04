import { useMemo } from "react";

import { useCelatoneApp, useCurrentChain } from "lib/app-provider";
import type { PermissionFilterValue } from "lib/hooks";
import {
  useUserKey,
  useCodePermissionFilter,
  useCodeSearchFilter,
} from "lib/hooks";
import { useCodeStore } from "lib/providers/store";
import type { CodeDataByCodeIdResponse } from "lib/services/codeService";
import {
  useCodeDataByCodeId,
  useCodeListByCodeIds,
  useCodeListByWalletAddress,
} from "lib/services/codeService";
import type { CodeInfo } from "lib/types";
import { AccessConfigPermission } from "lib/types";

export interface CodeDataState {
  isLoading: boolean;
  chainId: string;
  codeData: CodeDataByCodeIdResponse | undefined;
}

export const useCodeData = (codeId: number): CodeDataState => {
  const { currentChainId } = useCelatoneApp();

  const { data: codeData, isLoading } = useCodeDataByCodeId({
    codeId,
  });

  return {
    isLoading,
    chainId: currentChainId,
    codeData,
  };
};

const useStoredCodes = () => {
  const { address } = useCurrentChain();
  const { getCodeLocalInfo, isCodeIdSaved, isHydrated } = useCodeStore();

  const { data: rawStoredCodes, isLoading } =
    useCodeListByWalletAddress(address);

  const storedCodes =
    rawStoredCodes?.map<CodeInfo>((code) => ({
      ...code,
      name: getCodeLocalInfo(code.id)?.name,
      isSaved: isCodeIdSaved(code.id),
    })) ?? [];

  return { storedCodes, isLoading: isLoading && isHydrated };
};

const useSavedCodes = () => {
  const userKey = useUserKey();
  const { lastSavedCodes, lastSavedCodeIds, isHydrated } = useCodeStore();

  const savedCodeIds = lastSavedCodeIds(userKey);
  const { data: rawSavedCodes, isLoading } = useCodeListByCodeIds(savedCodeIds);

  const savedCodes = lastSavedCodes(userKey).map<CodeInfo>((localSavedCode) => {
    const rawSavedCode = rawSavedCodes?.find(
      (savedCode) => savedCode.id === localSavedCode.id
    );
    return {
      ...localSavedCode,
      contractCount: rawSavedCode?.contractCount,
      instantiatePermission:
        rawSavedCode?.instantiatePermission ?? AccessConfigPermission.UNKNOWN,
      permissionAddresses: rawSavedCode?.permissionAddresses ?? [],
      cw2Contract: rawSavedCode?.cw2Contract,
      cw2Version: rawSavedCode?.cw2Version,
      isSaved: true,
    };
  });

  return { savedCodes, isLoading: isLoading && isHydrated };
};

interface MyCodesData {
  savedCodes: CodeInfo[];
  storedCodes: CodeInfo[];
  savedCodesCount: number;
  storedCodesCount: number;
  allCodesCount: number;
  isStoredCodesLoading: boolean;
  isSavedCodesLoading: boolean;
}

export const useMyCodesData = (
  keyword: string,
  permissionValue: PermissionFilterValue
): MyCodesData => {
  const permissionFilterFn = useCodePermissionFilter(permissionValue);
  const searchFilterFn = useCodeSearchFilter(keyword);

  const { storedCodes, isLoading: isStoredCodesLoading } = useStoredCodes();
  const { savedCodes, isLoading: isSavedCodesLoading } = useSavedCodes();

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
    storedCodes: filteredStoredCodes,
    savedCodes: filteredSavedCodes,
    storedCodesCount,
    savedCodesCount,
    allCodesCount: storedCodesCount + savedCodesCount,
    isStoredCodesLoading,
    isSavedCodesLoading,
  };
};
