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
import type { ContractInfo } from "lib/stores/contract";
import type { CodeInfo, CodeDetails, ContractAddr } from "lib/types";
import { parseDateOpt, parseTxHashOpt } from "lib/utils";

export const useCodeListByUserQuery = (
  walletAddr: string | undefined
): UseQueryResult<CodeInfo[] | undefined> => {
  const queryFn = useCallback(async () => {
    if (!walletAddr) return undefined;

    return indexerGraphClient
      .request(getCodeListByUserQueryDocument, {
        walletAddr,
      })
      .then(({ codes }) =>
        codes.map<CodeInfo>((code) => ({
          id: code.id,
          contracts: code.instantiated,
          uploader: code.account.uploader,
        }))
      );
  }, [walletAddr]);

  // TODO: add query key later
  return useQuery(["codes_by_user", walletAddr], queryFn, {
    keepPreviousData: true,
    enabled: !!walletAddr,
  });
};

export const useCodeListByIDsQuery = (ids: number[] | undefined) => {
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
  codeId: number | undefined
): UseQueryResult<Omit<CodeDetails, "chainId"> | undefined> => {
  const queryFn = useCallback(async () => {
    if (!codeId) return undefined;

    return indexerGraphClient
      .request(getCodeInfoByCodeId, {
        codeId,
      })
      .then(({ codes }) => {
        const code = codes[0];
        return {
          codeId: code.id,
          uploader: code.account.address,
          hash: parseTxHashOpt(code.transaction?.hash),
          height: code.transaction?.block.height,
          created: parseDateOpt(code.transaction?.block?.timestamp),
          proposal: code.code_proposals[0]
            ? {
                proposalId: code.code_proposals[0].proposal_id,
                height: code.code_proposals[0].block?.height,
                created: parseDateOpt(code.code_proposals[0].block?.timestamp),
              }
            : undefined,
          permissionAddresses: code.access_config_addresses,
          instantiatePermission: code.access_config_permission,
        };
      });
  }, [codeId]);
  return useQuery(["code_info_by_id", codeId], queryFn, {
    keepPreviousData: true,
    enabled: !!codeId,
  });
};

export const useContractListByCodeId = (
  codeId: number | undefined,
  offset: number,
  pageSize: number
): UseQueryResult<ContractInfo[] | undefined> => {
  const queryFn = useCallback(async () => {
    if (!codeId) return undefined;

    return indexerGraphClient
      .request(getContractListByCodeId, { codeId, offset, pageSize })
      .then(({ contracts }) =>
        contracts.map<ContractInfo>((contract) => ({
          contractAddress: contract.address as ContractAddr,
          instantiator: contract.transaction?.account?.address ?? "",
          label: contract.label,
          created: parseDateOpt(contract.transaction?.block?.timestamp),
        }))
      );
  }, [codeId, offset, pageSize]);

  return useQuery(["contract_list_by_code_id", codeId], queryFn, {
    keepPreviousData: true,
    enabled: !!codeId,
  });
};

export const useContractListCountByCodeId = (
  codeId: number | undefined
): UseQueryResult<number | undefined> => {
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
