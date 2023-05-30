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
  hasTag?: boolean;
}

export const ContractsTable = ({
  contracts,
  isLoading,
  emptyState,
  onRowSelect,
  isReadOnly = false,
  withCTA,
  hasTag = true,
}: ContractsTableProps) => {
  if (isLoading) return <Loading />;
  if (!contracts?.length) return emptyState;

  let templateColumns: string;
  if (isReadOnly)
    templateColumns =
      "minmax(160px, 300px) minmax(300px, 3fr) minmax(200px, 2fr) 1fr";
  else if (hasTag)
    templateColumns =
      "160px minmax(300px, 3fr) minmax(200px, 2fr) 150px 260px 80px";
  else templateColumns = "250px minmax(300px, 3fr)  250px 300px 80px";

  return (
    <TableContainer>
      <ContractsTableHeader
        templateColumns={templateColumns}
        isReadOnly={isReadOnly}
        withCTA={withCTA}
        hasTag={hasTag}
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
          hasTag={hasTag}
        />
      ))}
    </TableContainer>
  );
};
