import { useCodeStore, useContractStore } from "lib/providers/store";
import { useAccountTableCounts } from "lib/services/accountService";
import { useBalances } from "lib/services/balanceService";
import {
  useAdminContractsByAddress,
  useInstantiatedContractsByAddress,
} from "lib/services/contractService";
import { useCodesByAddress } from "lib/services/wasm/code";
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
  tableCounts: {
    codesCount: Nullish<number>;
    contractsAdminCount: Nullish<number>;
    contractsCount: Nullish<number>;
    txsCount: Nullish<number>;
    proposalsCount: Nullish<number>;
    assetsCount: Option<number>;
  };
  isLoading: boolean;
  refetchCounts: () => void;
}

export const useAccountDetailsTableCounts = (
  address: BechAddr
): AccountDetailsTableCounts => {
  const {
    data,
    refetch,
    isLoading: isLoadingAccountTableCounts,
  } = useAccountTableCounts(address);
  const { data: balances, isLoading: isBalancesLoading } = useBalances(address);

  return {
    tableCounts: {
      codesCount: data?.code,
      contractsAdminCount: data?.contractByAdmin,
      contractsCount: data?.instantiated,
      txsCount: data?.tx,
      proposalsCount: data?.proposal,
      assetsCount: balances?.length,
    },
    isLoading: isLoadingAccountTableCounts || isBalancesLoading,
    refetchCounts: refetch,
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
      name: localInfo?.name,
      description: localInfo?.description,
      tags: localInfo?.tags,
      lists: localInfo?.lists,
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
      name: localInfo?.name,
      description: localInfo?.description,
      tags: localInfo?.tags,
      lists: localInfo?.lists,
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
    name: getCodeLocalInfo(code.id)?.name,
    isSaved: isCodeIdSaved(code.id),
  }));

  return {
    codes: data,
    isLoading,
  };
};
