/* eslint-disable sonarjs/no-identical-functions */
import type { UseQueryResult } from "@tanstack/react-query";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { useCelatoneApp } from "lib/app-provider";
import {
  getCodeInfoByCodeId,
  getCodeListByIDsQueryDocument,
  getCodeListByUserQueryDocument,
  getCodeListByWalletAddressWithPagination,
  getCodeListCountByWalletAddressWithPagination,
  getCodeListQueryDocument,
} from "lib/query/code";
import type {
  CodeInfo,
  CodeData,
  Option,
  InstantiatePermission,
  PermissionAddresses,
  Addr,
  HumanAddr,
} from "lib/types";
import { parseDateOpt, parseTxHashOpt } from "lib/utils";

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
            code.access_config_permission as InstantiatePermission,
          permissionAddresses:
            code.access_config_addresses as PermissionAddresses,
        }))
      );
  }, [indexerGraphClient]);

  return useQuery(["all_codes", indexerGraphClient], queryFn);
};

export const useCodeListPageQuery = ({
  walletAddr,
  ids,
}: {
  walletAddr: Option<HumanAddr>;
  ids: Option<number[]>;
}): [UseQueryResult<CodeInfo[]>, UseQueryResult<CodeInfo[]>] => {
  const { indexerGraphClient } = useCelatoneApp();

  const codeByUserQueryFn = useCallback(async () => {
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
            code.access_config_permission as InstantiatePermission,
          permissionAddresses:
            code.access_config_addresses as PermissionAddresses,
        }))
      );
  }, [walletAddr, indexerGraphClient]);

  const codeByIdsQueryFn = useCallback(async () => {
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
            code.access_config_permission as InstantiatePermission,
          permissionAddresses:
            code.access_config_addresses as PermissionAddresses,
        }))
      );
  }, [ids, indexerGraphClient]);

  return useQueries({
    queries: [
      {
        queryKey: ["codes_by_user", indexerGraphClient, walletAddr],
        queryFn: codeByUserQueryFn,
        enabled: !!walletAddr,
      },
      {
        queryKey: ["codes_by_ids", indexerGraphClient, ids],
        queryFn: codeByIdsQueryFn,
        enabled: !!ids,
      },
    ],
  });
};

export const useCodeInfoByCodeId = (
  codeId: Option<number>
): UseQueryResult<Omit<CodeData, "chainId"> | null> => {
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = useCallback(async () => {
    if (!codeId) throw new Error("Code ID not found (useCodeInfoByCodeId)");

    return indexerGraphClient
      .request(getCodeInfoByCodeId, {
        codeId,
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
        };
      });
  }, [codeId, indexerGraphClient]);
  return useQuery(["code_info_by_id", codeId, indexerGraphClient], queryFn, {
    keepPreviousData: true,
    enabled: !!codeId,
  });
};

export const useCodeListByWalletAddressWithPagination = (
  walletAddress: Option<HumanAddr>,
  offset: number,
  pageSize: number
): UseQueryResult<CodeInfo[]> => {
  const { indexerGraphClient } = useCelatoneApp();
  const queryFn = useCallback(async () => {
    if (!walletAddress)
      throw new Error(
        "Wallet address not found (useCodeListByWalletAddressWithPagination)"
      );
    return indexerGraphClient
      .request(getCodeListByWalletAddressWithPagination, {
        walletAddress,
        offset,
        pageSize,
      })
      .then(({ codes }) =>
        codes.map((code) => ({
          id: code.id,
          uploader: code.account.uploader as Addr,
          contractCount: code.contracts_aggregate.aggregate?.count,
          instantiatePermission:
            code.access_config_permission as InstantiatePermission,
          permissionAddresses:
            code.access_config_addresses as PermissionAddresses,
        }))
      );
  }, [indexerGraphClient, offset, pageSize, walletAddress]);

  return useQuery(
    [
      "code_list_by_user_address_pagination",
      indexerGraphClient,
      offset,
      pageSize,
      walletAddress,
    ],
    queryFn
  );
};

export const useCodeListCountByWalletAddressWithPagination = (
  walletAddress: Option<HumanAddr>
): UseQueryResult<Option<number>> => {
  const { indexerGraphClient } = useCelatoneApp();
  const queryFn = useCallback(async () => {
    if (!walletAddress)
      throw new Error(
        "Wallet address not found (useCodeListCountByWalletAddressWithPagination)"
      );

    return indexerGraphClient
      .request(getCodeListCountByWalletAddressWithPagination, {
        walletAddress,
      })
      .then(({ codes_aggregate }) => codes_aggregate?.aggregate?.count);
  }, [walletAddress, indexerGraphClient]);

  return useQuery(
    [
      "code_list_count_by_user_address_pagination",
      walletAddress,
      indexerGraphClient,
    ],
    queryFn,
    {
      keepPreviousData: true,
      enabled: !!walletAddress,
    }
  );
};
