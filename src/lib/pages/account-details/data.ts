import { useTierConfig } from "lib/app-provider";
import { useCodeStore, useContractStore } from "lib/providers/store";
import { useAccountTableCounts } from "lib/services/account";
import { useBalances } from "lib/services/bank";
import { useCodesByAddress } from "lib/services/wasm/code";
import {
  useAdminContractsByAddress,
  useInstantiatedContractsByAddress,
  useInstantiatedContractsByAddressLcd,
} from "lib/services/wasm/contract";
import type {
  BechAddr,
  CodeInfo,
  ContractInfo,
  Nullish,
  Option,
} from "lib/types";

// ------------------------------------------//
// ---------------TABLE COUNTS---------------//
// ------------------------------------------//

interface AccountDetailsTableCounts {
  isLoading: boolean;
  refetchCounts: () => void;
  tableCounts: {
    assetsCount: Option<number>;
    codesCount: Nullish<number>;
    contractsAdminCount: Nullish<number>;
    contractsCount: Nullish<number>;
    proposalsCount: Nullish<number>;
    txsCount: Nullish<number>;
  };
}

export const useAccountDetailsTableCounts = (
  address: BechAddr
): AccountDetailsTableCounts => {
  const { isFullTier } = useTierConfig();
  const {
    data,
    isLoading: isLoadingAccountTableCounts,
    refetch,
  } = useAccountTableCounts(address, { enabled: isFullTier });
  const { data: balances, isLoading: isBalancesLoading } = useBalances(address);

  if (!isFullTier) {
    return {
      isLoading: isBalancesLoading,
      refetchCounts: refetch,
      tableCounts: {
        assetsCount: balances?.length,
        codesCount: undefined,
        contractsAdminCount: undefined,
        contractsCount: undefined,
        proposalsCount: undefined,
        txsCount: undefined,
      },
    };
  }

  return {
    isLoading: isLoadingAccountTableCounts || isBalancesLoading,
    refetchCounts: refetch,
    tableCounts: {
      assetsCount: balances?.length,
      codesCount: data?.code,
      contractsAdminCount: data?.contractByAdmin,
      contractsCount: data?.instantiated,
      proposalsCount: data?.proposal,
      txsCount: data?.tx,
    },
  };
};

// ------------------------------------------//
// -----------------CONTRACTS----------------//
// ------------------------------------------//

interface AccountContracts {
  contracts: Option<ContractInfo[]>;
  isLoading: boolean;
}

export const useAccountContracts = (
  address: BechAddr,
  offset: number,
  limit: number
): AccountContracts => {
  const { data: contracts, isLoading } = useInstantiatedContractsByAddress(
    address,
    limit,
    offset
  );
  const { getContractLocalInfo } = useContractStore();
  const data = contracts?.items?.map<ContractInfo>((contract) => {
    const localInfo = getContractLocalInfo(contract.contractAddress);

    return {
      ...contract,
      description: localInfo?.description,
      lists: localInfo?.lists,
      name: localInfo?.name,
      tags: localInfo?.tags,
    };
  });
  return {
    contracts: data,
    isLoading,
  };
};

export const useAccountContractsLcd = (address: BechAddr): AccountContracts => {
  const { data: contracts, isLoading } = useInstantiatedContractsByAddressLcd(
    address,
    true
  );
  const { getContractLocalInfo } = useContractStore();
  const data = contracts?.map<ContractInfo>((contract) => {
    const localInfo = getContractLocalInfo(contract.contractAddress);

    return {
      ...contract,
      admin: undefined,
      description: localInfo?.description,
      latestUpdated: undefined,
      latestUpdater: undefined,
      lists: localInfo?.lists,
      name: localInfo?.name,
      remark: undefined,
      tags: localInfo?.tags,
    };
  });
  return {
    contracts: data,
    isLoading,
  };
};

export const useAccountAdminContracts = (
  address: BechAddr,
  offset: number,
  pageSize: number
): AccountContracts => {
  const { data: contractsAdmin, isLoading } = useAdminContractsByAddress(
    address,
    pageSize,
    offset
  );
  const { getContractLocalInfo } = useContractStore();

  const data = contractsAdmin?.items?.map<ContractInfo>((contractAdmin) => {
    const localInfo = getContractLocalInfo(contractAdmin.contractAddress);

    return {
      ...contractAdmin,
      description: localInfo?.description,
      lists: localInfo?.lists,
      name: localInfo?.name,
      tags: localInfo?.tags,
    };
  });

  return {
    contracts: data,
    isLoading,
  };
};

// ------------------------------------------//
// -------------------CODES------------------//
// ------------------------------------------//

interface AccountCodes {
  codes: Option<CodeInfo[]>;
  isLoading: boolean;
}

export const useAccountCodes = (
  address: BechAddr,
  offset: number,
  limit: number
): AccountCodes => {
  const { data: codes, isLoading } = useCodesByAddress(address, limit, offset);

  const { getCodeLocalInfo, isCodeIdSaved } = useCodeStore();

  const data = codes?.items?.map<CodeInfo>((code) => ({
    ...code,
    isSaved: isCodeIdSaved(code.id),
    name: getCodeLocalInfo(code.id)?.name,
  }));

  return {
    codes: data,
    isLoading,
  };
};
