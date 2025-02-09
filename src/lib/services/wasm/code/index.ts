import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";

import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCelatoneApp,
  useGovConfig,
} from "lib/app-provider";
import type { Code, CodeData, CodesResponse } from "lib/services/types";
import type { BechAddr, BechAddr20, Option } from "lib/types";

import {
  getAllCodesByAddress,
  getCodeData,
  getCodeList,
  getCodes,
  getCodesByAddress,
} from "./api";
import { getCodeLcd, getCodesLcd, getUploadAccessParamsLcd } from "./lcd";

export const useUploadAccessParamsLcd = () => {
  const {
    chainConfig: { lcd: lcdEndpoint },
  } = useCelatoneApp();

  return useQuery(
    [CELATONE_QUERY_KEYS.UPLOAD_ACCESS_PARAMS_LCD, lcdEndpoint],
    () => getUploadAccessParamsLcd(lcdEndpoint),
    { keepPreviousData: true, refetchOnWindowFocus: false, retry: false }
  );
};

export const useCodes = (
  limit: number,
  offset: number,
  address: Option<BechAddr20>,
  permission: Option<boolean>,
  options?: Pick<UseQueryOptions<CodesResponse>, "onSuccess">
) => {
  const endpoint = useBaseApiRoute("codes");

  return useQuery<CodesResponse>(
    [CELATONE_QUERY_KEYS.CODES, endpoint, limit, offset, address, permission],
    async () => getCodes(endpoint, limit, offset, address, permission),
    { retry: 1, refetchOnWindowFocus: false, ...options }
  );
};

export const useCodesLcd = () => {
  const {
    chainConfig: { lcd: lcdEndpoint },
  } = useCelatoneApp();

  return useInfiniteQuery(
    [CELATONE_QUERY_KEYS.CODES_LCD, lcdEndpoint],
    ({ pageParam }) => getCodesLcd(lcdEndpoint, pageParam),
    {
      getNextPageParam: (lastPage) => lastPage.pagination.nextKey ?? undefined,
      refetchOnWindowFocus: false,
    }
  );
};

export const useCodeData = (codeId: number, enabled = true) => {
  const { enabled: isGov } = useGovConfig({ shouldRedirect: false });
  const endpoint = useBaseApiRoute("codes");

  return useQuery<CodeData>(
    [CELATONE_QUERY_KEYS.CODE_DATA, endpoint, codeId, isGov],
    async () => getCodeData(endpoint, codeId, isGov),
    {
      retry: 1,
      refetchOnWindowFocus: false,
      enabled,
    }
  );
};

export const useCodeLcd = (
  codeId: number,
  options?: Omit<UseQueryOptions<Code>, "queryKey">
) => {
  const {
    chainConfig: { lcd: lcdEndpoint },
  } = useCelatoneApp();

  return useQuery<Code>(
    [CELATONE_QUERY_KEYS.CODE_DATA_LCD, lcdEndpoint, codeId],
    async () => getCodeLcd(lcdEndpoint, codeId),
    {
      retry: 1,
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};

export const useCodesByAddress = (
  address: BechAddr,
  limit: number,
  offset: number
): UseQueryResult<CodesResponse> => {
  const endpoint = useBaseApiRoute("accounts");

  return useQuery(
    [CELATONE_QUERY_KEYS.CODES_BY_ADDRESS, endpoint, address, limit, offset],
    async () => getCodesByAddress(endpoint, address, limit, offset),
    { retry: 1, refetchOnWindowFocus: false }
  );
};

export const useAllCodesByAddress = (
  address: BechAddr
): UseQueryResult<CodesResponse> => {
  const endpoint = useBaseApiRoute("accounts");

  return useQuery(
    [CELATONE_QUERY_KEYS.ALL_CODES_BY_ADDRESS, endpoint, address],
    async () => getAllCodesByAddress(endpoint, address),
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export const useCodeList = (codeIds: number[]) => {
  const endpoint = useBaseApiRoute("codes");

  return useQuery(
    [CELATONE_QUERY_KEYS.CODE_LIST, endpoint, codeIds],
    async () => getCodeList(endpoint, codeIds),
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export * from "./lcd";
