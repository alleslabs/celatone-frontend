/* eslint-disable sonarjs/no-identical-functions */
import type { UseQueryResult } from "@tanstack/react-query";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { useCelatoneApp } from "lib/app-provider";
import {
  getCodeInfoByCodeId,
  getCodeListByIDsQueryDocument,
  getCodeListByUserQueryDocument,
  getCodeListQueryDocument,
  getContractListByCodeId,
  getContractListCountByCodeId,
} from "lib/data/queries";
import type {
  CodeInfo,
  CodeData,
  ContractAddr,
  Option,
  ContractInfo,
  InstantiatePermission,
  PermissionAddresses,
  Addr,
} from "lib/types";
import { parseDateOpt, parseTxHashOpt } from "lib/utils";

export const useCodeListQuery = (): UseQueryResult<Option<CodeInfo[]>> => {
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

  return useQuery(["all_codes", indexerGraphClient], queryFn, {
    keepPreviousData: true,
  });
};

export const useCodeListPageQuery = ({
  walletAddr,
  ids,
}: {
  walletAddr: Option<string>;
  ids: Option<number[]>;
}) => {
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
        keepPreviousData: true,
        enabled: !!walletAddr,
      },
      {
        queryKey: ["codes_by_ids", indexerGraphClient, ids],
        queryFn: codeByIdsQueryFn,
        keepPreviousData: true,
        enabled: !!ids,
      },
    ],
  });
};

export const useCodeInfoByCodeId = (
  codeId: Option<number>
): UseQueryResult<Option<Omit<CodeData, "chainId">>> => {
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

export const useContractListByCodeId = (
  codeId: Option<number>,
  offset: number,
  pageSize: number
): UseQueryResult<Option<ContractInfo[]>> => {
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = useCallback(async () => {
    if (!codeId) throw new Error("Code ID not found (useContractListByCodeId)");

    return indexerGraphClient
      .request(getContractListByCodeId, { codeId, offset, pageSize })
      .then(({ contracts }) =>
        contracts.map<ContractInfo>((contract) => ({
          contractAddress: contract.address as ContractAddr,
          instantiator: contract.init_by.at(0)?.account.address as Addr,
          label: contract.label,
          admin: contract.admin?.address as Addr,
          latestUpdater: contract.contract_histories.at(0)?.account
            .address as Addr,
          latestUpdated: parseDateOpt(
            contract.contract_histories.at(0)?.block.timestamp
          ),
          remark: contract.contract_histories.at(0)?.remark,
        }))
      );
  }, [codeId, indexerGraphClient, offset, pageSize]);

  return useQuery(
    ["contract_list_by_code_id", codeId, indexerGraphClient, offset, pageSize],
    queryFn,
    {
      keepPreviousData: true,
      enabled: !!codeId,
    }
  );
};

export const useContractListCountByCodeId = (
  codeId: Option<number>
): UseQueryResult<Option<number>> => {
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = useCallback(async () => {
    if (!codeId)
      throw new Error("Code ID not found (useContractListCountByCodeId)");

    return indexerGraphClient
      .request(getContractListCountByCodeId, {
        codeId,
      })
      .then(({ contracts_aggregate }) => contracts_aggregate?.aggregate?.count);
  }, [codeId, indexerGraphClient]);

  return useQuery(
    ["contract_list_count_by_user", codeId, indexerGraphClient],
    queryFn,
    {
      keepPreviousData: true,
      enabled: !!codeId,
    }
  );
};
