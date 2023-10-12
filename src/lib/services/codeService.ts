/* eslint-disable sonarjs/no-identical-functions */
import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCelatoneApp,
  useWasmConfig,
} from "lib/app-provider";
import {
  getCodeDataByCodeId,
  getCodeListByIDsQueryDocument,
  getCodeListByUserQueryDocument,
  getCodeListByWalletAddressPagination,
  getCodeListCountByWalletAddress,
  getCodeListQueryDocument,
} from "lib/query";
import { createQueryFnWithTimeout } from "lib/query-utils";
import type {
  CodeInfo,
  CodeData,
  Option,
  AccessConfigPermission,
  PermissionAddresses,
  Addr,
  HumanAddr,
} from "lib/types";
import { isCodeId, parseDateOpt, parseTxHashOpt } from "lib/utils";

import type { CodeIdInfoResponse } from "./code";
import { getCodeIdInfo } from "./code";

export const useCodeListQuery = (): UseQueryResult<CodeInfo[]> => {
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = useCallback(async () => {
    return indexerGraphClient
      .request(getCodeListQueryDocument)
      .then(({ codes }) =>
        codes.map<CodeInfo>((code) => ({
          id: code.id,
          uploader: code.account.uploader as Addr,
          contractCount: code.contracts_aggregate.aggregate?.count,
          instantiatePermission:
            code.access_config_permission as AccessConfigPermission,
          permissionAddresses:
            code.access_config_addresses as PermissionAddresses,
          cw2Contract: code.cw2_contract,
          cw2Version: code.cw2_version,
        }))
      );
  }, [indexerGraphClient]);

  return useQuery([CELATONE_QUERY_KEYS.CODES, indexerGraphClient], queryFn);
};

export const useCodeListByWalletAddress = (
  walletAddr: Option<HumanAddr>
): UseQueryResult<CodeInfo[]> => {
  const { indexerGraphClient } = useCelatoneApp();
  const queryFn = useCallback(async () => {
    if (!walletAddr)
      throw new Error("Wallet address not found (codeByUserQueryFn)");

    return indexerGraphClient
      .request(getCodeListByUserQueryDocument, {
        walletAddr,
      })
      .then(({ codes }) =>
        codes.map<CodeInfo>((code) => ({
          id: code.id,
          uploader: code.account.uploader as Addr,
          contractCount: code.contracts_aggregate.aggregate?.count,
          instantiatePermission:
            code.access_config_permission as AccessConfigPermission,
          permissionAddresses:
            code.access_config_addresses as PermissionAddresses,
          cw2Contract: code.cw2_contract,
          cw2Version: code.cw2_version,
        }))
      );
  }, [walletAddr, indexerGraphClient]);

  return useQuery(
    [
      CELATONE_QUERY_KEYS.CODES_BY_WALLET_ADDRESS,
      walletAddr,
      indexerGraphClient,
    ],
    queryFn,
    {
      keepPreviousData: true,
      enabled: !!walletAddr,
    }
  );
};

export const useCodeListByCodeIds = (
  ids: Option<number[]>
): UseQueryResult<CodeInfo[]> => {
  const { indexerGraphClient } = useCelatoneApp();
  const queryFn = useCallback(async () => {
    if (!ids) throw new Error("Code IDs not found (codeByIdsQueryFn)");

    return indexerGraphClient
      .request(getCodeListByIDsQueryDocument, {
        ids,
      })
      .then(({ codes }) =>
        codes.map<CodeInfo>((code) => ({
          id: code.id,
          uploader: code.account.uploader as Addr,
          contractCount: code.contracts_aggregate.aggregate?.count,
          instantiatePermission:
            code.access_config_permission as AccessConfigPermission,
          permissionAddresses:
            code.access_config_addresses as PermissionAddresses,
          cw2Contract: code.cw2_contract,
          cw2Version: code.cw2_version,
        }))
      );
  }, [ids, indexerGraphClient]);

  return useQuery(
    [CELATONE_QUERY_KEYS.CODES_BY_IDS, ids, indexerGraphClient],
    queryFn,
    {
      keepPreviousData: true,
      enabled: !!ids,
    }
  );
};

interface CodeDataByCodeIdParams {
  codeId: string;
  enabled?: boolean;
}

export const useCodeDataByCodeId = ({
  codeId,
  enabled = true,
}: CodeDataByCodeIdParams): UseQueryResult<Omit<
  CodeData,
  "chainId"
> | null> => {
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = useCallback(async () => {
    if (!codeId) throw new Error("Code ID not found (useCodeDataByCodeId)");

    return indexerGraphClient
      .request(getCodeDataByCodeId, {
        codeId: Number(codeId),
      })
      .then(({ codes_by_pk }) => {
        if (!codes_by_pk) return null;

        return {
          codeId: codes_by_pk.id,
          uploader: codes_by_pk.account.address as Addr,
          hash: parseTxHashOpt(codes_by_pk.transaction?.hash),
          height: codes_by_pk.transaction?.block.height,
          created: parseDateOpt(codes_by_pk.transaction?.block?.timestamp),
          proposal: codes_by_pk.code_proposals[0]
            ? {
                proposalId: codes_by_pk.code_proposals[0].proposal_id,
                height: codes_by_pk.code_proposals[0].block?.height,
                created: parseDateOpt(
                  codes_by_pk.code_proposals[0].block?.timestamp
                ),
              }
            : undefined,
          permissionAddresses:
            codes_by_pk.access_config_addresses as PermissionAddresses,
          instantiatePermission: codes_by_pk.access_config_permission,
          cw2Contract: codes_by_pk.cw2_contract,
          cw2Version: codes_by_pk.cw2_version,
        };
      });
  }, [codeId, indexerGraphClient]);
  return useQuery(
    [CELATONE_QUERY_KEYS.CODE_DATA_BY_ID, codeId, indexerGraphClient],
    queryFn,
    {
      enabled: enabled && isCodeId(codeId),
    }
  );
};

export const useCodeListByWalletAddressPagination = (
  walletAddress: Option<HumanAddr>,
  offset: number,
  pageSize: number
): UseQueryResult<CodeInfo[]> => {
  const { indexerGraphClient } = useCelatoneApp();
  const wasm = useWasmConfig({ shouldRedirect: false });

  const queryFn = useCallback(async () => {
    if (!walletAddress)
      throw new Error(
        "Wallet address not found (useCodeListByWalletAddressPagination)"
      );
    return indexerGraphClient
      .request(getCodeListByWalletAddressPagination, {
        walletAddress,
        offset,
        pageSize,
      })
      .then(({ codes }) =>
        codes.map<CodeInfo>((code) => ({
          id: code.id,
          uploader: code.account.uploader as Addr,
          contractCount: code.contracts_aggregate.aggregate?.count,
          instantiatePermission:
            code.access_config_permission as AccessConfigPermission,
          permissionAddresses:
            code.access_config_addresses as PermissionAddresses,
          cw2Contract: code.cw2_contract,
          cw2Version: code.cw2_version,
        }))
      );
  }, [indexerGraphClient, offset, pageSize, walletAddress]);

  return useQuery(
    [
      CELATONE_QUERY_KEYS.CODES_BY_WALLET_ADDRESS_PAGINATION,
      indexerGraphClient,
      offset,
      pageSize,
      walletAddress,
    ],
    createQueryFnWithTimeout(queryFn),
    {
      enabled: wasm.enabled && !!walletAddress,
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export const useCodeListCountByWalletAddress = (
  walletAddress: Option<HumanAddr>
): UseQueryResult<Option<number>> => {
  const { indexerGraphClient } = useCelatoneApp();
  const wasm = useWasmConfig({ shouldRedirect: false });

  const queryFn = useCallback(async () => {
    if (!walletAddress)
      throw new Error(
        "Wallet address not found (useCodeListCountByWalletAddress)"
      );

    return indexerGraphClient
      .request(getCodeListCountByWalletAddress, {
        walletAddress,
      })
      .then(({ codes_aggregate }) => codes_aggregate?.aggregate?.count);
  }, [walletAddress, indexerGraphClient]);

  return useQuery(
    [
      CELATONE_QUERY_KEYS.CODES_BY_WALLET_ADDRESS_COUNT,
      walletAddress,
      indexerGraphClient,
    ],
    queryFn,
    {
      keepPreviousData: true,
      enabled: wasm.enabled && !!walletAddress,
    }
  );
};

export type LCDCodeInfoSuccessCallback = (data: CodeIdInfoResponse) => void;

export const useLCDCodeInfo = (
  codeId: string,
  options?: Omit<UseQueryOptions<CodeIdInfoResponse>, "queryKey">
): UseQueryResult<CodeIdInfoResponse> => {
  const lcdEndpoint = useBaseApiRoute("rest");
  const queryFn = async () => getCodeIdInfo(lcdEndpoint, codeId);
  return useQuery(
    [CELATONE_QUERY_KEYS.CODE_INFO, lcdEndpoint, codeId],
    queryFn,
    options
  );
};
