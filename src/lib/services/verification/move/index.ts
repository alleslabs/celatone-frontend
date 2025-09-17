import type { UseQueryResult } from "@tanstack/react-query";
import type {
  MoveVerifyByTaskIdResponse,
  MoveVerifyInfoResponse,
  MoveVerifyInfosByAddressResponse,
} from "lib/services/types";
import type { Addr, HexAddr, Nullable, Option } from "lib/types";

import {
  keepPreviousData,
  useMutation,
  useQueries,
  useQuery,
} from "@tanstack/react-query";
import { CELATONE_QUERY_KEYS, useCelatoneApp } from "lib/app-provider";

import {
  getMoveVerifyByTaskId,
  getMoveVerifyConfig,
  getMoveVerifyInfo,
  getMoveVerifyInfosByAddress,
  submitMoveVerify,
} from "./api";

export const useMoveVerifyConfig = () =>
  useQuery({
    queryFn: getMoveVerifyConfig,
    queryKey: [CELATONE_QUERY_KEYS.MOVE_VERIFY_CONFIG],
    refetchOnWindowFocus: false,
    retry: 1,
    retryOnMount: false,
    staleTime: Infinity,
  });

export const useSubmitMoveVerify = () =>
  useMutation({
    mutationFn: submitMoveVerify,
  });

export const useMoveVerifyTaskInfos = (
  taskIds: string[],
  onSuccess?: (data: MoveVerifyByTaskIdResponse) => void
) => {
  const { currentChainId } = useCelatoneApp();

  return useQueries({
    queries: taskIds.map((taskId) => ({
      onSuccess,
      placeholderData: keepPreviousData,
      queryFn: () => getMoveVerifyByTaskId(currentChainId, taskId),
      queryKey: [
        CELATONE_QUERY_KEYS.MOVE_VERIFY_TASK_BY_TASK_ID,
        currentChainId,
        taskId,
      ],
      refetchOnWindowFocus: false,
      retry: 0,
    })),
  });
};

export const useMoveVerifyTaskInfo = (
  taskId: string,
  enabled = true
): UseQueryResult<MoveVerifyByTaskIdResponse> => {
  const { currentChainId } = useCelatoneApp();

  return useQuery({
    enabled,
    placeholderData: keepPreviousData,
    queryFn: () => getMoveVerifyByTaskId(currentChainId, taskId),
    queryKey: [
      CELATONE_QUERY_KEYS.MOVE_VERIFY_TASK_BY_TASK_ID,
      currentChainId,
      taskId,
    ],
    refetchOnWindowFocus: false,
    retry: 0,
  });
};

export const useMoveVerifyInfo = (
  address: Option<Addr>,
  moduleName: Option<string>
): UseQueryResult<Nullable<MoveVerifyInfoResponse>> => {
  const { currentChainId } = useCelatoneApp();

  return useQuery({
    enabled: Boolean(address && moduleName),
    placeholderData: (previousData) => previousData,
    queryFn: () => {
      if (!address || !moduleName)
        throw new Error(
          "address or module name is undefined (useMoveVerifyInfo)"
        );
      return getMoveVerifyInfo(currentChainId, address, moduleName);
    },
    queryKey: [
      CELATONE_QUERY_KEYS.MOVE_VERIFY_INFO,
      currentChainId,
      address,
      moduleName,
    ],
    refetchOnWindowFocus: false,
    retry: 0,
  });
};

export const useMoveVerifyInfos = (
  moduleInfos: { address: HexAddr; moduleName: string }[],
  enabled = true
) => {
  const { currentChainId } = useCelatoneApp();

  return useQueries({
    queries: moduleInfos.map(({ address, moduleName }) => ({
      enabled,
      placeholderData: keepPreviousData,
      queryFn: () => getMoveVerifyInfo(currentChainId, address, moduleName),
      queryKey: [
        CELATONE_QUERY_KEYS.MOVE_VERIFY_INFO,
        currentChainId,
        address,
        moduleName,
      ],
      refetchOnWindowFocus: false,
      retry: 0,
    })),
  });
};

export const useMoveVerifyInfosByAddress = (
  address: Option<HexAddr>
): UseQueryResult<MoveVerifyInfosByAddressResponse> => {
  const { currentChainId } = useCelatoneApp();

  return useQuery({
    enabled: Boolean(address),
    placeholderData: (previousData) => previousData,
    queryFn: () => {
      if (!address)
        throw new Error("address is undefined (useMoveVerifyInfosByAddress)");
      return getMoveVerifyInfosByAddress(currentChainId, address);
    },
    queryKey: [
      CELATONE_QUERY_KEYS.MOVE_VERIFY_INFOS_BY_ADDRESS,
      currentChainId,
      address,
    ],
    refetchOnWindowFocus: false,
    retry: 0,
  });
};
