import { useCodeStore, useContractStore } from "lib/providers/store";
import {
  useContractDataByContractAddress,
  useMigrationHistoriesByContractAddress,
} from "lib/services/contractService";
import type { ContractAddr, ContractMigrationHistory } from "lib/types";

export const useContractData = (contractAddress: ContractAddr) => {
  const { getCodeLocalInfo } = useCodeStore();
  const { getContractLocalInfo } = useContractStore();

  const result = useContractDataByContractAddress(contractAddress);

  const codeLocalInfo = result.data?.contract
    ? getCodeLocalInfo(Number(result.data.contract.codeId))
    : undefined;
  const contractLocalInfo = getContractLocalInfo(contractAddress);

  return {
    codeLocalInfo,
    contractLocalInfo,
    ...result,
  };
};

export const useMigrationHistories = (
  contractAddress: ContractAddr,
  offset: number,
  pageSize: number
) => {
  const { data, ...res } = useMigrationHistoriesByContractAddress(
    contractAddress,
    offset,
    pageSize
  );
  const { getCodeLocalInfo } = useCodeStore();

  return {
    data: data
      ? {
          items: data.items.map<ContractMigrationHistory>((migration) => ({
            ...migration,
            codeName: getCodeLocalInfo(migration.codeId)?.name,
          })),
        }
      : undefined,
    ...res,
  };
};
