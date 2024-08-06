import { useMutation, useQuery } from "@tanstack/react-query";

// TODO: refactor app-provider/app-fns
import { useCelatoneApp } from "lib/app-provider/contexts";
import { CELATONE_QUERY_KEYS } from "lib/app-provider/env";
import type { Option } from "lib/types";

import {
  getWasmRelatedVerifyInfos,
  getWasmVerifyInfos,
  submitWasmVerify,
} from "./api";

export const useSubmitWasmVerify = () =>
  useMutation({
    mutationFn: submitWasmVerify,
  });

export const useWasmVerifyInfos = (codeIds: number[], enabled = true) => {
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

const useWasmRelatedVerifyInfos = (hashes: string[], enabled = true) => {
  const { currentChainId } = useCelatoneApp();
  return useQuery(
    [
      CELATONE_QUERY_KEYS.WASM_VERIFICATION_INFOS,
      currentChainId,
      ...hashes.sort(),
    ],
    () => getWasmRelatedVerifyInfos(currentChainId, hashes),
    {
      enabled,
      refetchOnWindowFocus: false,
      retry: false,
    }
  );
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
  const wasmRelatedVerifyInfo = wasmRelatedVerifyInfos?.[hash ?? ""];
  return {
    data: {
      verificationInfo: wasmVerifyInfo?.verificationInfo ?? null,
      schema: wasmRelatedVerifyInfo?.schema ?? wasmVerifyInfo?.schema ?? null,
      relatedVerifiedCodes:
        wasmRelatedVerifyInfo?.relatedVerifiedCodes ??
        wasmVerifyInfo?.relatedVerifiedCodes ??
        [],
    },
    isLoading: false,
  };
};
