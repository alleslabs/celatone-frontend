import { useWallet } from "@cosmos-kit/react";

import { useChainId } from "lib/app-provider";
import { useUserKey } from "lib/hooks";
import { useCodeStore } from "lib/providers/store";
import {
  useCodeDataByCodeId,
  useCodeListByCodeIds,
  useCodeListByWalletAddress,
} from "lib/services/codeService";
import {
  usePublicProjectByCodeId,
  usePublicProjectBySlug,
} from "lib/services/publicProjectService";
import type {
  CodeData,
  PublicDetail,
  Option,
  PublicCodeData,
  HumanAddr,
  CodeInfo,
} from "lib/types";
import { InstantiatePermission } from "lib/types";

export interface CodeDataState {
  isLoading: boolean;
  chainId: string;
  codeData: Option<CodeData>;
  publicProject: {
    publicCodeData: Option<PublicCodeData>;
    publicDetail: Option<PublicDetail>;
  };
}

export const useCodeData = (codeId: number): CodeDataState => {
  const { data: codeInfo, isLoading } = useCodeDataByCodeId(codeId);
  const { data: publicCodeInfo } = usePublicProjectByCodeId(codeId);
  const { data: publicInfoBySlug } = usePublicProjectBySlug(
    publicCodeInfo?.slug
  );

  const chainId = useChainId();

  return {
    isLoading,
    chainId,
    codeData: codeInfo as CodeData,
    publicProject: {
      publicCodeData: publicCodeInfo,
      publicDetail: publicInfoBySlug?.details,
    },
  };
};

export const useStoredCodes = () => {
  const { address } = useWallet();
  const { getCodeLocalInfo, isCodeIdSaved } = useCodeStore();

  const { data: rawStoredCodes, isLoading } = useCodeListByWalletAddress(
    address as HumanAddr
  );

  const storedCodes =
    rawStoredCodes?.map<CodeInfo>((code) => ({
      ...code,
      name: getCodeLocalInfo(code.id)?.name,
      isSaved: isCodeIdSaved(code.id),
    })) ?? [];

  return { storedCodes, isLoading };
};

export const useSavedCodes = () => {
  const userKey = useUserKey();
  const { lastSavedCodes, lastSavedCodeIds } = useCodeStore();

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
        rawSavedCode?.instantiatePermission ?? InstantiatePermission.UNKNOWN,
      permissionAddresses: rawSavedCode?.permissionAddresses ?? [],
      isSaved: true,
    };
  });

  return { savedCodes, isLoading };
};
