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
      queryKey: [
        CELATONE_QUERY_KEYS.MOVE_VERIFY_TASK_BY_TASK_ID,
        currentChainId,
        taskId,
      ],
      queryFn: () => getMoveVerifyByTaskId(currentChainId, taskId),
      retry: 0,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      onSuccess,
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
      retry: 0,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
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
      retry: 0,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
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
      queryKey: [
        CELATONE_QUERY_KEYS.MOVE_VERIFY_INFO,
        currentChainId,
        address,
        moduleName,
      ],
      queryFn: () => getMoveVerifyInfo(currentChainId, address, moduleName),
      enabled,
      retry: 0,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
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
      retry: 0,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );
};
