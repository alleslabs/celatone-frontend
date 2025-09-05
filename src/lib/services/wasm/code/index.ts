import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { Code, CodeData, CodesResponse } from "lib/services/types";
import type { BechAddr, BechAddr20, Option } from "lib/types";

import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCelatoneApp,
  useGovConfig,
  useTierConfig,
} from "lib/app-provider";

import {
  getAllCodesByAddress,
  getCodeData,
  getCodeList,
  getCodes,
  getCodesByAddress,
} from "./api";
import { getCodeRest, getCodesRest, getUploadAccessParamsRest } from "./rest";

export const useUploadAccessParamsRest = () => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  return useQuery({
    placeholderData: keepPreviousData,
    queryFn: () => getUploadAccessParamsRest(restEndpoint),
    queryKey: [CELATONE_QUERY_KEYS.UPLOAD_ACCESS_PARAMS_REST, restEndpoint],
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useCodes = (
  limit: number,
  offset: number,
  address: Option<BechAddr20>,
  permission: Option<boolean>,
  options?: Partial<UseQueryOptions<CodesResponse>>
) => {
  const endpoint = useBaseApiRoute("codes");

  return useQuery<CodesResponse>({
    queryKey: [
      CELATONE_QUERY_KEYS.CODES,
      endpoint,
      limit,
      offset,
      address,
      permission,
    ],
    queryFn: async () => getCodes(endpoint, limit, offset, address, permission),
    refetchOnWindowFocus: false,
    retry: 1,
    ...options,
  });
};

export const useCodesRest = () => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  return useInfiniteQuery({
    queryKey: [CELATONE_QUERY_KEYS.CODES_REST, restEndpoint],
    queryFn: ({ pageParam }: { pageParam?: string }) =>
      getCodesRest(restEndpoint, pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.pagination.nextKey ?? undefined,
    refetchOnWindowFocus: false,
  });
};

export const useCodeData = (codeId: number, enabled = true) => {
  const { enabled: isGov } = useGovConfig({ shouldRedirect: false });
  const endpoint = useBaseApiRoute("codes");

  return useQuery<CodeData>({
    enabled,
    queryFn: async () => getCodeData(endpoint, codeId, isGov),
    queryKey: [CELATONE_QUERY_KEYS.CODE_DATA, endpoint, codeId, isGov],
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useCodeRest = (
  codeId: Option<number>,
  { enabled, ...options }: Omit<UseQueryOptions<Code>, "queryKey"> = {}
) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  return useQuery<Code>({
    enabled: !!codeId && enabled,
    queryFn: async () => {
      if (!codeId) throw new Error("codeId is undefined (useCodeRest)");
      return getCodeRest(restEndpoint, codeId);
    },
    queryKey: [CELATONE_QUERY_KEYS.CODE_DATA_REST, restEndpoint, codeId],
    refetchOnWindowFocus: false,
    retry: 1,
    ...options,
  });
};

export const useCodesByAddress = (
  address: BechAddr,
  limit: number,
  offset: number
): UseQueryResult<CodesResponse> => {
  const endpoint = useBaseApiRoute("accounts");

  return useQuery({
    queryFn: async () => getCodesByAddress(endpoint, address, limit, offset),
    queryKey: [
      CELATONE_QUERY_KEYS.CODES_BY_ADDRESS,
      endpoint,
      address,
      limit,
      offset,
    ],
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useAllCodesByAddress = (
  address: BechAddr
): UseQueryResult<CodesResponse> => {
  const endpoint = useBaseApiRoute("accounts");
  const { isFullTier } = useTierConfig();

  return useQuery({
    enabled: isFullTier,
    queryFn: async () => getAllCodesByAddress(endpoint, address),
    queryKey: [CELATONE_QUERY_KEYS.ALL_CODES_BY_ADDRESS, endpoint, address],
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useCodeList = (codeIds: number[]) => {
  const endpoint = useBaseApiRoute("codes");
  const { isFullTier } = useTierConfig();

  return useQuery({
    enabled: isFullTier,
    queryFn: async () => getCodeList(endpoint, codeIds),
    queryKey: [CELATONE_QUERY_KEYS.CODE_LIST, endpoint, codeIds],
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export * from "./rest";
