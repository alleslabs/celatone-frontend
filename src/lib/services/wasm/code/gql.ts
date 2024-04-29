import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { CELATONE_QUERY_KEYS, useCelatoneApp } from "lib/app-provider";
import {
  getCodeListByIDsQueryDocument,
  getCodeListByUserQueryDocument,
} from "lib/query";
import type {
  AccessConfigPermission,
  BechAddr,
  BechAddr20,
  CodeInfo,
  Option,
  PermissionAddresses,
} from "lib/types";

export const useCodeListByWalletAddress = (
  walletAddr: Option<BechAddr20>
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
          uploader: code.account.uploader as BechAddr,
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
          uploader: code.account.uploader as BechAddr,
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
