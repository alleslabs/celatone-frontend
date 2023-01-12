import { useCodeStore } from "lib/hooks";
import { useMigrationHistoriesByContractAddress } from "lib/services/contractService";
import type { ContractAddr, ContractMigrationHistory, Option } from "lib/types";

export const useMigrationHistories = (
  contractAddress: ContractAddr,
  offset: number,
  pageSize: number
): Option<ContractMigrationHistory[]> => {
  const { data: migrationData } = useMigrationHistoriesByContractAddress(
    contractAddress,
    offset,
    pageSize
  );
  const { getCodeLocalInfo } = useCodeStore();

  if (!migrationData) return undefined;

  return migrationData.map<ContractMigrationHistory>((data) => {
    const localInfo = getCodeLocalInfo(data.codeId);
    return {
      ...data,
      codeDescription: localInfo?.description,
    };
  });
};
