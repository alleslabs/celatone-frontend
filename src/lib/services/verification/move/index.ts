import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";

import { CELATONE_QUERY_KEYS, useInitiaL1 } from "lib/app-provider";
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
  const isInitiaL1 = useInitiaL1({ shouldRedirect: false });

  return useQueries({
    queries: taskIds.map((taskId) => ({
      queryKey: [
        CELATONE_QUERY_KEYS.MOVE_VERIFY_TASK_BY_TASK_ID,
        taskId,
        isInitiaL1,
      ],
      queryFn: () => getMoveVerifyByTaskId(taskId),
      enabled: isInitiaL1,
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
  const isInitiaL1 = useInitiaL1({ shouldRedirect: false });

  return useQuery(
    [CELATONE_QUERY_KEYS.MOVE_VERIFY_TASK_BY_TASK_ID, taskId, isInitiaL1],
    () => getMoveVerifyByTaskId(taskId),
    {
      enabled: enabled && isInitiaL1,
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
  const isInitiaL1 = useInitiaL1({ shouldRedirect: false });

  return useQuery(
    [CELATONE_QUERY_KEYS.MOVE_VERIFY_INFO, address, moduleName, isInitiaL1],
    () => {
      if (!address || !moduleName)
        throw new Error(
          "address or module name is undefined (useMoveVerifyInfo)"
        );
      return getMoveVerifyInfo(address, moduleName);
    },
    {
      enabled: isInitiaL1,
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
  const isInitiaL1 = useInitiaL1({ shouldRedirect: false });

  return useQueries({
    queries: moduleInfos.map(({ address, moduleName }) => ({
      queryKey: [
        CELATONE_QUERY_KEYS.MOVE_VERIFY_INFO,
        address,
        moduleName,
        isInitiaL1,
      ],
      queryFn: () => getMoveVerifyInfo(address, moduleName),
      enabled: enabled && isInitiaL1,
      retry: 0,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    })),
  });
};

export const useMoveVerifyInfosByAddress = (
  address: Option<Addr>
): UseQueryResult<MoveVerifyInfosByAddressResponse> => {
  const isInitiaL1 = useInitiaL1({ shouldRedirect: false });
  return useQuery(
    [CELATONE_QUERY_KEYS.MOVE_VERIFY_INFOS_BY_ADDRESS, address, isInitiaL1],
    () => {
      if (!address)
        throw new Error("address is undefined (useMoveVerifyInfosByAddress)");
      return getMoveVerifyInfosByAddress(address);
    },
    {
      enabled: Boolean(address) && isInitiaL1,
      retry: 0,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );
};
