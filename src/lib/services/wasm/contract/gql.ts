import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import {
  CELATONE_QUERY_KEYS,
  useCelatoneApp,
  useWasmConfig,
} from "lib/app-provider";
import {
  getAdminByContractAddressesQueryDocument,
  getContractListByAdmin,
  getInstantiatedCountByUserQueryDocument,
  getInstantiatedListByUserQueryDocument,
} from "lib/query";
import type { ContractLocalInfo } from "lib/stores/contract";
import type { BechAddr, BechAddr20, BechAddr32, Dict, Option } from "lib/types";

export const useInstantiatedCountByAddress = (
  walletAddr: Option<BechAddr20>
): UseQueryResult<Option<number>> => {
  const { indexerGraphClient } = useCelatoneApp();
  const wasm = useWasmConfig({ shouldRedirect: false });

  const queryFn = useCallback(async () => {
    if (!walletAddr)
      throw new Error(
        "Wallet address not found (useInstantiatedCountByAddress)"
      );

    return indexerGraphClient
      .request(getInstantiatedCountByUserQueryDocument, {
        walletAddr,
      })
      .then(({ contracts_aggregate }) => contracts_aggregate?.aggregate?.count);
  }, [indexerGraphClient, walletAddr]);

  return useQuery(
    [
      CELATONE_QUERY_KEYS.INSTANTIATED_COUNT_BY_WALLET_ADDRESS,
      indexerGraphClient,
      walletAddr,
    ],
    queryFn,
    {
      keepPreviousData: true,
      enabled: wasm.enabled && Boolean(walletAddr),
    }
  );
};

export const useInstantiatedListByAddress = (
  walletAddr: Option<BechAddr20>,
  enabled = false
): UseQueryResult<ContractLocalInfo[]> => {
  const { indexerGraphClient } = useCelatoneApp();
  const queryFn = useCallback(async () => {
    if (!walletAddr)
      throw new Error(
        "Wallet address not found (useInstantiatedListByAddress)"
      );

    return indexerGraphClient
      .request(getInstantiatedListByUserQueryDocument, {
        walletAddr,
      })
      .then(({ contracts }) =>
        contracts.map<ContractLocalInfo>((contractInst) => ({
          contractAddress: contractInst.address as BechAddr32,
          instantiator: contractInst.accountByInitBy?.address as BechAddr,
          label: contractInst.label,
        }))
      );
  }, [indexerGraphClient, walletAddr]);

  return useQuery(
    [
      CELATONE_QUERY_KEYS.INSTANTIATED_LIST_BY_WALLET_ADDRESS,
      indexerGraphClient,
      walletAddr,
    ],
    queryFn,
    { enabled: Boolean(walletAddr) && enabled, refetchOnWindowFocus: false }
  );
};

export const useContractListByAdmin = (
  adminAddress: Option<BechAddr>
): UseQueryResult<ContractLocalInfo[]> => {
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = useCallback(async () => {
    if (!adminAddress)
      throw new Error("Admin address not found (useContractListByAdmin)");

    return indexerGraphClient
      .request(getContractListByAdmin, {
        address: adminAddress,
      })
      .then(({ contracts }) =>
        contracts.map<ContractLocalInfo>((contractAdmin) => ({
          contractAddress: contractAdmin.address as BechAddr32,
          instantiator: contractAdmin.accountByInitBy?.address as BechAddr,
          label: contractAdmin.label,
        }))
      );
  }, [adminAddress, indexerGraphClient]);

  return useQuery(
    [CELATONE_QUERY_KEYS.CONTRACTS_BY_ADMIN, adminAddress, indexerGraphClient],
    queryFn,
    {
      keepPreviousData: true,
      enabled: Boolean(adminAddress),
    }
  );
};

export const useAdminByContractAddresses = (
  contractAddresses: BechAddr32[]
): UseQueryResult<Dict<BechAddr32, BechAddr>> => {
  const { indexerGraphClient } = useCelatoneApp();

  const queryFn = useCallback(
    async () =>
      indexerGraphClient
        .request(getAdminByContractAddressesQueryDocument, {
          contractAddresses,
        })
        .then(({ contracts }) =>
          contracts.reduce<Dict<BechAddr32, BechAddr>>(
            (prev, contract) => ({
              ...prev,
              [contract.address as BechAddr32]: contract.admin
                ?.address as BechAddr,
            }),
            {}
          )
        ),
    [contractAddresses, indexerGraphClient]
  );

  return useQuery(
    [
      CELATONE_QUERY_KEYS.ADMINS_BY_CONTRACTS,
      contractAddresses,
      indexerGraphClient,
    ],
    queryFn,
    {
      keepPreviousData: true,
      enabled: contractAddresses.length > 0,
    }
  );
};
