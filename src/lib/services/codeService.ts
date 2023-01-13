import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { indexerGraphClient } from "lib/data/graphql";
import {
  getCodeInfoByCodeId,
  getCodeListByIDsQueryDocument,
  getCodeListByUserQueryDocument,
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
} from "lib/types";
import { parseDateDefault, parseTxHashOpt, unwrap } from "lib/utils";

export const useCodeListByUserQuery = (
  walletAddr: Option<string>
): UseQueryResult<Option<CodeInfo[]>> => {
  const queryFn = useCallback(async () => {
    if (!walletAddr) return undefined;

    return indexerGraphClient
      .request(getCodeListByUserQueryDocument, {
        walletAddr,
      })
      .then(({ codes }) =>
        codes.map<CodeInfo>((code) => ({
          id: code.id,
          contracts: code.contracts_aggregate.aggregate?.count ?? 0,
          uploader: code.account.uploader,
          instantiatePermission:
            code.access_config_permission as InstantiatePermission,
          permissionAddresses:
            code.access_config_addresses as PermissionAddresses,
        }))
      );
  }, [walletAddr]);

  // TODO: add query key later
  return useQuery(["codes_by_user", walletAddr], queryFn, {
    keepPreviousData: true,
    enabled: !!walletAddr,
  });
};

export const useCodeListByIDsQuery = (ids: Option<number[]>) => {
  const queryFn = useCallback(async () => {
    if (!ids) return undefined;

    return indexerGraphClient
      .request(getCodeListByIDsQueryDocument, {
        ids,
      })
      .then(({ codes }) =>
        codes.map<CodeInfo>((code) => ({
          id: code.id,
          uploader: code.account.uploader,
          contracts: code.instantiated,
          instantiatePermission:
            code.access_config_permission as InstantiatePermission,
          permissionAddresses:
            code.access_config_addresses as PermissionAddresses,
        }))
      );
  }, [ids]);

  // TODO: add query key later
  return useQuery(["codes_by_ids", ids], queryFn, {
    keepPreviousData: true,
    enabled: !!ids,
  });
};

export const useCodeInfoByCodeId = (
  codeId: Option<number>
): UseQueryResult<Option<Omit<CodeData, "chainId">>> => {
  const queryFn = useCallback(async () => {
    if (!codeId) return undefined;

    return indexerGraphClient
      .request(getCodeInfoByCodeId, {
        codeId,
      })
      .then(({ codes_by_pk }) => {
        if (!codes_by_pk) return null;

        return {
          codeId: codes_by_pk.id,
          uploader: codes_by_pk.account.address,
          hash: parseTxHashOpt(codes_by_pk.transaction?.hash),
          height: codes_by_pk.transaction?.block.height,
          created: parseDateDefault(codes_by_pk.transaction?.block?.timestamp),
          proposal: codes_by_pk.code_proposals[0]
            ? {
                proposalId: codes_by_pk.code_proposals[0].proposal_id,
                height: codes_by_pk.code_proposals[0].block?.height ?? 0,
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
  }, [codeId]);
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
  const queryFn = useCallback(async () => {
    if (!codeId) return undefined;

    return indexerGraphClient
      .request(getContractListByCodeId, { codeId, offset, pageSize })
      .then(({ contracts }) =>
        contracts.map<ContractInfo>((contract) => ({
          contractAddress: contract.address as ContractAddr,
          instantiator: unwrap(contract.transaction?.account.address),
          label: contract.label,
          instantiated: parseDateDefault(contract.transaction?.block.timestamp),
          // TODO: handle Genesis case
          latestUpdator:
            contract.contract_histories.at(0)?.account.address ?? "",
          latestUpdated: parseDateDefault(
            contract.contract_histories.at(0)?.block.timestamp
          ),
        }))
      );
  }, [codeId, offset, pageSize]);

  return useQuery(["contract_list_by_code_id", codeId], queryFn, {
    keepPreviousData: true,
    enabled: !!codeId,
  });
};

export const useContractListCountByCodeId = (
  codeId: Option<number>
): UseQueryResult<Option<number>> => {
  const queryFn = useCallback(async () => {
    if (!codeId) return undefined;

    return indexerGraphClient
      .request(getContractListCountByCodeId, {
        codeId,
      })
      .then(({ contracts_aggregate }) => contracts_aggregate?.aggregate?.count);
  }, [codeId]);

  return useQuery(["contract_list_count_by_user", codeId], queryFn, {
    keepPreviousData: true,
    enabled: !!codeId,
  });
};
