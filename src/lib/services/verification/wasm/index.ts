import { useMutation, useQuery } from "@tanstack/react-query";

import { CELATONE_QUERY_KEYS, useCelatoneApp } from "lib/app-provider";

import { getWasmVerifyInfos, submitWasmVerify } from "./api";

export const useSubmitWasmVerify = () =>
  useMutation({
    mutationFn: submitWasmVerify,
  });

export const useGetWasmVerifyInfos = (codeIds: number[], enabled = true) => {
  const { currentChainId } = useCelatoneApp();
  return useQuery(
    [
      CELATONE_QUERY_KEYS.WASM_VERIFICATION_INFOS,
      currentChainId,
      ...codeIds.sort(),
    ],
    () => getWasmVerifyInfos(currentChainId, codeIds),
    {
      enabled,
      refetchOnWindowFocus: false,
      retry: false,
    }
  );
};
