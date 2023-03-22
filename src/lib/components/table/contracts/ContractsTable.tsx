import { TableContainer } from "../tableComponents";
import { Loading } from "lib/components/Loading";
import type { ContractAddr, ContractInfo, Option } from "lib/types";

import { ContractsTableHeader } from "./ContractsTableHeader";
import { ContractsTableRow } from "./ContractsTableRow";
import type { CTAInfo } from "./ContractsTableRowCTA";

interface ContractsTableProps {
  contracts: Option<ContractInfo[]>;
  isLoading: boolean;
  emptyState: JSX.Element;
  onRowSelect: (contract: ContractAddr) => void;
  isReadOnly?: boolean;
  withCTA?: CTAInfo;
}

export const ContractsTable = ({
  contracts,
  isLoading,
  emptyState,
  onRowSelect,
  isReadOnly = false,
  withCTA,
}: ContractsTableProps) => {
  if (isLoading) return <Loading />;
  if (!contracts?.length) return emptyState;

  const templateColumns = isReadOnly
    ? "minmax(160px, 300px) minmax(300px, 3fr) minmax(200px, 2fr) 1fr"
    : "160px minmax(300px, 3fr) minmax(200px, 2fr) 150px 250px 60px";

  return (
    <TableContainer>
      <ContractsTableHeader
        templateColumns={templateColumns}
        isReadOnly={isReadOnly}
        withCTA={withCTA}
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
          templateColumns={templateColumns}
          onRowSelect={onRowSelect}
          isReadOnly={isReadOnly}
          withCTA={withCTA}
        />
      ))}
    </TableContainer>
  );
};
