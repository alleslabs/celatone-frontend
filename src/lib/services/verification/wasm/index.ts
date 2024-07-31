import { useMutation, useQuery } from "@tanstack/react-query";

import { CELATONE_QUERY_KEYS } from "lib/app-provider";

import { getWasmVerifyInfos, submitWasmVerify } from "./api";

export const useSubmitWasmVerify = () =>
  useMutation({
    mutationFn: submitWasmVerify,
  });

export const useGetWasmVerifyInfos = (chainId: string, codeIds: number[]) =>
  useQuery(
    [CELATONE_QUERY_KEYS.WASM_VERIFICATION_INFOS, ...codeIds.sort()],
    () => getWasmVerifyInfos(chainId, codeIds),
    {
      refetchOnWindowFocus: false,
      retry: false,
    }
  );
