import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";

import { CELATONE_QUERY_KEYS, useCelatoneApp } from "lib/app-provider";
import type {
  MoveVerifyByTaskIdResponse,
  MoveVerifyInfoResponse,
  MoveVerifyInfosByModuleResponse,
  SubmitMoveVerifyResponse,
} from "lib/services/types";
import type { Addr, Nullable, Option } from "lib/types";

import {
  getMoveVerifyByTaskId,
  getMoveVerifyInfo,
  getMoveVerifyInfosByModule,
  getSubmitMoveVerify,
} from "./api";

export const useSubmitMoveVerify = (
  formData: FormData
): UseQueryResult<SubmitMoveVerifyResponse> => {
  const { chainConfig } = useCelatoneApp();
  const {
    extra: { layer },
  } = chainConfig;

  return useQuery(
    [CELATONE_QUERY_KEYS.MOVE_VERIFY_SUBMIT, formData, layer],
    () => getSubmitMoveVerify(formData),
    {
      enabled: layer === "1",
      retry: 0,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );
};

export const useGetMoveVerifyTaskInfo = (
  taskId: string
): UseQueryResult<MoveVerifyByTaskIdResponse> => {
  const { chainConfig } = useCelatoneApp();
  const {
    extra: { layer },
  } = chainConfig;

  return useQuery(
    [CELATONE_QUERY_KEYS.MOVE_VERIFY_TASK_BY_TASK_ID, taskId, layer],
    () => getMoveVerifyByTaskId(taskId),
    {
      enabled: layer === "1",
      retry: 0,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );
};

export const useMoveVerifyInfo = (
  address: Option<Addr>,
  moduleName: Option<string>
): UseQueryResult<Nullable<MoveVerifyInfoResponse>> => {
  const { chainConfig } = useCelatoneApp();
  const {
    extra: { layer },
  } = chainConfig;

  return useQuery(
    [CELATONE_QUERY_KEYS.MOVE_VERIFY_INFO, address, moduleName, layer],
    () => {
      if (!address || !moduleName) return null;
      return getMoveVerifyInfo(address, moduleName);
    },
    {
      enabled: layer === "1" && Boolean(address && moduleName),
      retry: 0,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );
};

export const useMoveVerifyInfosByModule = (
  address: Option<Addr>
): UseQueryResult<Nullable<MoveVerifyInfosByModuleResponse>> => {
  const { chainConfig } = useCelatoneApp();
  const {
    extra: { layer },
  } = chainConfig;

  return useQuery(
    [CELATONE_QUERY_KEYS.MOVE_VERIFY_INFOS_BY_MODULE, address, layer],
    () => {
      if (!address) return null;
      return getMoveVerifyInfosByModule(address);
    },
    {
      enabled: layer === "1" && Boolean(address),
      retry: 0,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );
};
