/* eslint-disable sonarjs/no-identical-functions */
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
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
  HumanAddr,
} from "lib/types";
import { parseDateDefault, parseTxHashOpt, unwrap } from "lib/utils";

export const useCodeListQuery = (): UseQueryResult<Option<CodeInfo[]>> => {
  const { indexerGraphClient } = useCelatoneApp();
  const queryFn = useCallback(async () => {
    return indexerGraphClient
      .request(getCodeListQueryDocument)
      .then(({ codes }) =>
        codes.map<CodeInfo>((code) => ({
          id: code.id,
          uploader: code.account.uploader as ContractAddr | HumanAddr,
          contracts: code.contracts_aggregate.aggregate?.count ?? 0,
          instantiatePermission:
            code.access_config_permission as InstantiatePermission,
          permissionAddresses:
            code.access_config_addresses as PermissionAddresses,
        }))
      );
  }, [indexerGraphClient]);

  // TODO: add query key later
  return useQuery(["all_codes"], queryFn, {
    keepPreviousData: true,
  });
};

export const useCodeListByUserQuery = (
  walletAddr: Option<string>
): UseQueryResult<Option<CodeInfo[]>> => {
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = useCallback(async () => {
    if (!walletAddr)
      throw new Error("Wallet address not found (useCodeListByUserQuery)");

    return indexerGraphClient
      .request(getCodeListByUserQueryDocument, {
        walletAddr,
      })
      .then(({ codes }) =>
        codes.map<CodeInfo>((code) => ({
          id: code.id,
          uploader: code.account.uploader as ContractAddr | HumanAddr,
          contracts: code.contracts_aggregate.aggregate?.count ?? 0,
          instantiatePermission:
            code.access_config_permission as InstantiatePermission,
          permissionAddresses:
            code.access_config_addresses as PermissionAddresses,
        }))
      );
  }, [indexerGraphClient, walletAddr]);

  // TODO: add query key later
  return useQuery(["codes_by_user", walletAddr], queryFn, {
    keepPreviousData: true,
    enabled: !!walletAddr,
  });
};

export const useCodeListByIDsQuery = (ids: Option<number[]>) => {
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = useCallback(async () => {
    if (!ids) throw new Error("Code IDs not found (useCodeListByIDsQuery)");

    return indexerGraphClient
      .request(getCodeListByIDsQueryDocument, {
        ids,
      })
      .then(({ codes }) =>
        codes.map<CodeInfo>((code) => ({
          id: code.id,
          uploader: code.account.uploader as ContractAddr | HumanAddr,
          contracts: code.contracts_aggregate.aggregate?.count ?? 0,
          instantiatePermission:
            code.access_config_permission as InstantiatePermission,
          permissionAddresses:
            code.access_config_addresses as PermissionAddresses,
        }))
      );
  }, [ids, indexerGraphClient]);

  // TODO: add query key later
  return useQuery(["codes_by_ids", ids], queryFn, {
    keepPreviousData: true,
    enabled: !!ids,
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
          uploader: codes_by_pk.account.address as ContractAddr | HumanAddr,
          hash: parseTxHashOpt(codes_by_pk.transaction?.hash),
          height: codes_by_pk.transaction?.block.height,
          created: parseDateDefault(codes_by_pk.transaction?.block?.timestamp),
          proposal: codes_by_pk.code_proposals[0]
            ? {
                proposalId: codes_by_pk.code_proposals[0].proposal_id,
                height: codes_by_pk.code_proposals[0].block?.height,
                created: parseDateDefault(
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
  return useQuery(["code_info_by_id", codeId], queryFn, {
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
          instantiator: unwrap(contract.init_by.at(0)?.account.address),
          label: contract.label,
          admin: contract.admin?.address,
          instantiated: parseDateDefault(
            contract.init_by.at(0)?.block.timestamp
          ),
          // TODO: handle Genesis case
          latestUpdator: contract.contract_histories.at(0)?.account.address,
          latestUpdated: parseDateDefault(
            contract.contract_histories.at(0)?.block.timestamp
          ),
        }))
      );
  }, [codeId, indexerGraphClient, offset, pageSize]);

  return useQuery(["contract_list_by_code_id", codeId], queryFn, {
    keepPreviousData: true,
    enabled: !!codeId,
  });
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

  return useQuery(["contract_list_count_by_user", codeId], queryFn, {
    keepPreviousData: true,
    enabled: !!codeId,
  });
};
