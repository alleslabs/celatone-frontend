import type { UseQueryResult } from "@tanstack/react-query";

import { useTierConfig } from "lib/app-provider";
import { useCodeStore, useContractStore } from "lib/providers/store";
import type { ContractData } from "lib/services/types";
import { useCodeLcd } from "lib/services/wasm/code";
import {
  useContractCw2InfoLcd,
  useContractData,
  useMigrationHistoriesByContractAddress,
  useMigrationHistoriesByContractAddressLcd,
} from "lib/services/wasm/contract";
import { RemarkOperation } from "lib/types";
import type { BechAddr32, ContractMigrationHistory } from "lib/types";

const useContractDataLcd = (
  contractData: UseQueryResult<ContractData>,
  contractAddress: BechAddr32
) => {
  const { isFullTier } = useTierConfig();

  const { data: code } = useCodeLcd(
    Number(contractData.data?.contract.codeId),
    {
      enabled: !isFullTier && !!contractData.data?.contract.codeId,
    }
  );
  const { data: cw2Info } = useContractCw2InfoLcd(contractAddress, !isFullTier);
  const { data: migrationHistories } =
    useMigrationHistoriesByContractAddressLcd(contractAddress, !isFullTier);

  return !isFullTier && contractData.data
    ? {
        ...contractData,
        data: {
          ...contractData.data,
          contract: {
            ...contractData.data.contract,
            codeHash: code?.hash ?? "",
            cw2Contract: cw2Info?.contract ?? null,
            cw2Version: cw2Info?.version ?? null,
            initMsg:
              migrationHistories?.entries.find(
                (history) =>
                  history.remark?.operation ===
                  RemarkOperation.CONTRACT_CODE_HISTORY_OPERATION_TYPE_INIT
              )?.msg ?? "",
          },
        },
      }
    : contractData;
};

export const useContractDataWithLocalInfos = (contractAddress: BechAddr32) => {
  const { getCodeLocalInfo } = useCodeStore();
  const { getContractLocalInfo } = useContractStore();

  let result = useContractData(contractAddress);
  result = useContractDataLcd(result, contractAddress);

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
