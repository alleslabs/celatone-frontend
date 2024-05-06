import type { UseQueryOptions } from "@tanstack/react-query";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";

import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useLcdEndpoint,
} from "lib/app-provider";
import type { CodeInfoResponseLcd, CodesResponseLcd } from "lib/services/types";
import { zCodeInfoResponseLcd, zCodesResponseLcd } from "lib/services/types";
import type { Option } from "lib/types";
import { isId, parseWithError } from "lib/utils";

export const getCodeIdInfoLcd = async (
  endpoint: string,
  id: number
): Promise<CodeInfoResponseLcd> =>
  axios
    .get(`${endpoint}/cosmwasm/wasm/v1/code/${id}`)
    .then(({ data }) => parseWithError(zCodeInfoResponseLcd, data));

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
    [CELATONE_QUERY_KEYS.CODE_INFO, endpoint, codeId],
    queryFn,
    options
  );
};

const getCodesLcd = async (
  endpoint: string,
  paginationKey: Option<string>
): Promise<CodesResponseLcd> =>
  axios
    .get(`${endpoint}/cosmwasm/wasm/v1/code`, {
      params: {
        "pagination.limit": 10,
        "pagination.reverse": true,
        "pagination.key": paginationKey,
      },
    })
    .then(({ data }) => parseWithError(zCodesResponseLcd, data));

export const useCodesLcd = () => {
  const endpoint = useLcdEndpoint();

  return useInfiniteQuery(
    [CELATONE_QUERY_KEYS.CODES, endpoint],
    ({ pageParam }) => getCodesLcd(endpoint, pageParam),
    {
      getNextPageParam: (lastPage) => lastPage.pagination.nextKey ?? undefined,
      refetchOnWindowFocus: false,
    }
  );
};
