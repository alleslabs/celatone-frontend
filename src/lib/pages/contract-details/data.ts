import { useCodeStore, useContractStore } from "lib/providers/store";
import {
  useContractData,
  useMigrationHistoriesByContractAddress,
  useMigrationHistoriesByContractAddressLcd,
} from "lib/services/wasm/contract";
import type { BechAddr32, ContractMigrationHistory } from "lib/types";

export const useContractDataWithLocalInfos = (contractAddress: BechAddr32) => {
  const { getCodeLocalInfo } = useCodeStore();
  const { getContractLocalInfo } = useContractStore();

  const result = useContractData(contractAddress);

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
  contractAddress: BechAddr32,
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

export const useMigrationHistoriesLcd = (contractAddress: BechAddr32) => {
  const { data, ...res } =
    useMigrationHistoriesByContractAddressLcd(contractAddress);

  const { getCodeLocalInfo } = useCodeStore();

  return {
    data: data
      ? data.entries.map((migration) => ({
          ...migration,
          codeName: getCodeLocalInfo(migration.codeId)?.name,
        }))
      : undefined,
    ...res,
  };
};
