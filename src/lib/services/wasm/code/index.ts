import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";

import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useGovConfig,
  useLcdEndpoint,
} from "lib/app-provider";
import type {
  CodeData,
  CodeInfoResponseLcd,
  CodesResponse,
} from "lib/services/types";
import type { BechAddr, BechAddr20, Option } from "lib/types";
import { isId } from "lib/utils";

import { getCodeDataByCodeId, getCodes, getCodesByAddress } from "./api";
import { getCodeIdInfoLcd, getCodesLcd } from "./lcd";

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
  const endpoint = useLcdEndpoint();

  return useInfiniteQuery(
    [CELATONE_QUERY_KEYS.CODES_LCD, endpoint],
    ({ pageParam }) => getCodesLcd(endpoint, pageParam),
    {
      getNextPageParam: (lastPage) => lastPage.pagination.nextKey ?? undefined,
      refetchOnWindowFocus: false,
    }
  );
};

export const useCodeDataByCodeId = (codeId: number, enabled = true) => {
  const { enabled: isGov } = useGovConfig({ shouldRedirect: false });
  const endpoint = useBaseApiRoute("codes");

  return useQuery<CodeData>(
    [CELATONE_QUERY_KEYS.CODE_DATA, endpoint, codeId, isGov],
    async () => getCodeDataByCodeId(endpoint, codeId, isGov),
    {
      retry: 1,
      refetchOnWindowFocus: false,
      enabled,
    }
  );
};

export const useCodeInfoLcd = (
  codeId: string,
  options?: Omit<UseQueryOptions<CodeInfoResponseLcd>, "queryKey">
) => {
  const endpoint = useBaseApiRoute("rest");

  const queryFn = async () => {
    if (!isId(codeId)) throw new Error("Invalid code ID");
    return getCodeIdInfoLcd(endpoint, Number(codeId));
  };

  return useQuery<CodeInfoResponseLcd>(
    [CELATONE_QUERY_KEYS.CODE_INFO_LCD, endpoint, codeId],
    queryFn,
    options
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

export * from "./gql";
