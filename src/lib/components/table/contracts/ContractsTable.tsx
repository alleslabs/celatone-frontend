import type { BechAddr32, ContractInfo, Option } from "lib/types";

import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { useWasmVerifyInfos } from "lib/services/verification/wasm";
import { JSX } from "react";

import type { CtaInfo } from "./ContractsTableRowCta";

import { MobileTableContainer, TableContainer } from "../tableComponents";
import { ContractsTableHeader } from "./ContractsTableHeader";
import { ContractsTableMobileCard } from "./ContractsTableMobileCard";
import { ContractsTableRow } from "./ContractsTableRow";

interface ContractsTableProps {
  contracts: Option<ContractInfo[]>;
  isLoading: boolean;
  emptyState: JSX.Element;
  onRowSelect: (contract: BechAddr32) => void;
  showTag?: boolean;
  showLastUpdate?: boolean;
  isReadOnly?: boolean;
  withCta?: CtaInfo;
}

export const ContractsTable = ({
  contracts,
  isLoading,
  emptyState,
  onRowSelect,
  showTag = true,
  showLastUpdate = true,
  isReadOnly = false,
  withCta,
}: ContractsTableProps) => {
  const isMobile = useMobile();
  const { data: wasmVerifyInfos, isFetching: isWasmVerifyInfosFetching } =
    useWasmVerifyInfos(
      contracts?.reduce<number[]>((acc, contract) => {
        if (contract.codeId) acc.push(contract.codeId);
        return acc;
      }, []) ?? [],
      !!contracts
    );

  if (isLoading || isWasmVerifyInfosFetching) return <Loading />;
  if (!contracts?.length) return emptyState;

  let templateColumns: string;
  if (isReadOnly)
    templateColumns = `minmax(180px, 300px) minmax(300px, 3fr) minmax(200px, 2fr)${showLastUpdate ? " 1fr" : ""}`;
  else if (!showTag)
    templateColumns = `180px minmax(300px, 3fr)${showLastUpdate ? " 250px 300px" : ""} 80px`;
  else
    templateColumns = `180px minmax(300px, 3fr) minmax(200px, 2fr)${showLastUpdate ? " 150px 260px" : ""} 80px`;

  return isMobile ? (
    <MobileTableContainer>
      {contracts.map((contractInfo) => (
        <ContractsTableMobileCard
          key={
            contractInfo.name +
            contractInfo.contractAddress +
            contractInfo.description +
            contractInfo.tags +
            contractInfo.lists
          }
          contractInfo={contractInfo}
          showLastUpdate={showLastUpdate}
          wasmVerifyInfo={
            contractInfo.codeId
              ? wasmVerifyInfos?.[contractInfo.codeId]
              : undefined
          }
          onRowSelect={onRowSelect}
        />
      ))}
    </MobileTableContainer>
  ) : (
    <TableContainer pb={6}>
      <ContractsTableHeader
        isReadOnly={isReadOnly}
        showLastUpdate={showLastUpdate}
        showTag={showTag}
        templateColumns={templateColumns}
        withCta={withCta}
      />
      {contracts.map((contractInfo) => (
        <ContractsTableRow
          key={
            contractInfo.name +
            contractInfo.contractAddress +
            contractInfo.description +
            contractInfo.tags +
            contractInfo.lists
          }
          contractInfo={contractInfo}
          isReadOnly={isReadOnly}
          showLastUpdate={showLastUpdate}
          showTag={showTag}
          templateColumns={templateColumns}
          wasmVerifyInfo={
            contractInfo.codeId
              ? wasmVerifyInfos?.[contractInfo.codeId]
              : undefined
          }
          withCta={withCta}
          onRowSelect={onRowSelect}
        />
      ))}
    </TableContainer>
  );
};
