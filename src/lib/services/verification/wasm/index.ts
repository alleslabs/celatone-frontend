import type { AxiosError } from "axios";
import type { WasmVerifyRequest } from "lib/services/types";
import type { Option } from "lib/types";

// TODO: refactor app-provider/app-fns
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCelatoneApp } from "lib/app-provider/contexts";
import { CELATONE_QUERY_KEYS } from "lib/app-provider/env";

import {
  getWasmRelatedVerifyInfos,
  getWasmVerifyInfos,
  submitWasmVerify,
} from "./api";

export const useSubmitWasmVerify = () =>
  useMutation<
    void,
    AxiosError<{ message: string; statusCode: number }>,
    WasmVerifyRequest
  >({
    mutationFn: submitWasmVerify,
  });

export const useWasmVerifyInfos = (codeIds: number[], enabled = true) => {
  const { currentChainId } = useCelatoneApp();
  return useQuery({
    enabled,
    queryFn: () => getWasmVerifyInfos(currentChainId, codeIds),
    queryKey: [
      CELATONE_QUERY_KEYS.WASM_VERIFICATION_INFOS,
      currentChainId,
      ...codeIds.sort(),
    ],
    refetchOnWindowFocus: false,
    retry: false,
    retryOnMount: false,
    staleTime: Infinity,
  });
};

const useWasmRelatedVerifyInfos = (hashes: string[], enabled = true) => {
  const { currentChainId } = useCelatoneApp();
  return useQuery({
    enabled,
    queryFn: () => getWasmRelatedVerifyInfos(currentChainId, hashes),
    queryKey: [
      CELATONE_QUERY_KEYS.WASM_RELATED_VERIFICATION_INFOS,
      currentChainId,
      ...hashes.sort(),
    ],
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: Infinity,
  });
};

export const useDerivedWasmVerifyInfo = (
  codeId: Option<number>,
  hash: Option<string>
) => {
  const { data: wasmVerifyInfos, isFetching: isWasmVerifyInfosFetching } =
    useWasmVerifyInfos([Number(codeId)], !!codeId);
  const {
    data: wasmRelatedVerifyInfos,
    isFetching: isWasmRelatedVerifyInfosFetching,
  } = useWasmRelatedVerifyInfos([hash ?? ""], !!hash);

  if (isWasmVerifyInfosFetching || isWasmRelatedVerifyInfosFetching)
    return { data: undefined, isLoading: true };

  const wasmVerifyInfo = wasmVerifyInfos?.[Number(codeId)];
  const wasmRelatedVerifyInfo =
    wasmRelatedVerifyInfos?.[hash?.toUpperCase() ?? ""];
  return {
    data: {
      relatedVerifiedCodes:
        wasmRelatedVerifyInfo?.relatedVerifiedCodes ??
        wasmVerifyInfo?.relatedVerifiedCodes ??
        [],
      schema: wasmRelatedVerifyInfo?.schema ?? wasmVerifyInfo?.schema ?? null,
      verificationInfo: wasmVerifyInfo?.verificationInfo ?? null,
    },
    isLoading: false,
  };
};
