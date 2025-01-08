import type { UseQueryResult } from "@tanstack/react-query";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";

import { CELATONE_QUERY_KEYS, useCelatoneApp } from "lib/app-provider";
import type {
  MoveVerifyByTaskIdResponse,
  MoveVerifyInfoResponse,
  MoveVerifyInfosByAddressResponse,
} from "lib/services/types";
import type { Addr, HexAddr, Option } from "lib/types";

import {
  getMoveVerifyByTaskId,
  getMoveVerifyInfo,
  getMoveVerifyInfosByAddress,
  submitMoveVerify,
} from "./api";

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
      keepPreviousData: true,
      onSuccess,
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

  return useQuery(
    [CELATONE_QUERY_KEYS.MOVE_VERIFY_TASK_BY_TASK_ID, currentChainId, taskId],
    () => getMoveVerifyByTaskId(currentChainId, taskId),
    {
      enabled,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      retry: 0,
    }
  );
};

export const useMoveVerifyInfo = (
  address: Option<Addr>,
  moduleName: Option<string>
): UseQueryResult<MoveVerifyInfoResponse> => {
  const { currentChainId } = useCelatoneApp();

  return useQuery(
    [CELATONE_QUERY_KEYS.MOVE_VERIFY_INFO, currentChainId, address, moduleName],
    () => {
      if (!address || !moduleName)
        throw new Error(
          "address or module name is undefined (useMoveVerifyInfo)"
        );
      return getMoveVerifyInfo(currentChainId, address, moduleName);
    },
    {
      enabled: Boolean(address && moduleName),
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      retry: 0,
    }
  );
};

export const useMoveVerifyInfos = (
  moduleInfos: { address: HexAddr; moduleName: string }[],
  enabled = true
) => {
  const { currentChainId } = useCelatoneApp();

  return useQueries({
    queries: moduleInfos.map(({ address, moduleName }) => ({
      enabled,
      keepPreviousData: true,
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
  address: Option<Addr>
): UseQueryResult<MoveVerifyInfosByAddressResponse> => {
  const { currentChainId } = useCelatoneApp();

  return useQuery(
    [CELATONE_QUERY_KEYS.MOVE_VERIFY_INFOS_BY_ADDRESS, currentChainId, address],
    () => {
      if (!address)
        throw new Error("address is undefined (useMoveVerifyInfosByAddress)");
      return getMoveVerifyInfosByAddress(currentChainId, address);
    },
    {
      enabled: Boolean(address),
      keepPreviousData: true,
      refetchOnWindowFocus: false,
      retry: 0,
    }
  );
};
