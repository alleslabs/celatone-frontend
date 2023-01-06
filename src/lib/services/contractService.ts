import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import { indexerGraphClient } from "lib/data/graphql";
import {
  getInstantiatedListByUserQueryDocument,
  getInstantiatedCountByUserQueryDocument,
  getInstantiateDetailByContractQueryDocument,
} from "lib/data/queries";
import type { ContractInfo } from "lib/stores/contract";
import type { ContractAddr, HumanAddr } from "lib/types";
import { parseDateOpt, parseTxHash } from "lib/utils";

interface InstantiateDetail {
  initMsg: string;
  initTxHash?: string;
}

export const useInstantiatedCountByUserQuery = (
  walletAddr: HumanAddr | undefined
): UseQueryResult<number | undefined> => {
  const queryFn = useCallback(async () => {
    if (!walletAddr) return undefined;

    return indexerGraphClient
      .request(getInstantiatedCountByUserQueryDocument, {
        walletAddr,
      })
      .then(({ contracts_aggregate }) => contracts_aggregate?.aggregate?.count);
  }, [walletAddr]);

  // TODO: add query key later
  return useQuery(["instantiated_count_by_user", walletAddr], queryFn, {
    keepPreviousData: true,
    enabled: !!walletAddr,
  });
};

export const useInstantiatedListByUserQuery = (
  walletAddr: HumanAddr | undefined
): UseQueryResult<ContractInfo[] | undefined> => {
  const queryFn = useCallback(async () => {
    if (!walletAddr) return undefined;

    return indexerGraphClient
      .request(getInstantiatedListByUserQueryDocument, {
        walletAddr,
      })
      .then(({ contracts }) =>
        contracts.map<ContractInfo>((contract) => ({
          contractAddress: contract.address as ContractAddr,
          instantiator: walletAddr,
          label: contract.label,
          created: parseDateOpt(contract.transaction?.block?.timestamp),
        }))
      );
  }, [walletAddr]);

  // TODO: add query key later
  return useQuery(["instantiated_list_by_user", walletAddr], queryFn, {
    keepPreviousData: true,
    enabled: !!walletAddr,
  });
};

export const useInstantiateDetailByContractQuery = (
  contractAddress: ContractAddr
): UseQueryResult<InstantiateDetail> => {
  const queryFn = useCallback(async () => {
    return indexerGraphClient
      .request(getInstantiateDetailByContractQueryDocument, { contractAddress })
      .then(({ contracts_by_pk }) => ({
        // TODO: revisit undefined after backend remove nullable
        initMsg: contracts_by_pk?.init_msg ?? "{}",
        initTxHash: parseTxHash(contracts_by_pk?.transaction?.hash),
      }));
  }, [contractAddress]);

  return useQuery(
    ["instantiate_detail_by_contract", contractAddress],
    queryFn,
    {
      keepPreviousData: true,
    }
  );
};
