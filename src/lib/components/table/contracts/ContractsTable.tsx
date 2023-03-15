import { TableContainer } from "@chakra-ui/react";

import { Loading } from "lib/components/Loading";
import type { ContractInfo, Option } from "lib/types";

import { ContractsTableHeader } from "./ContractsTableHeader";
import { ContractsTableRow } from "./ContractsTableRow";

interface ContractsTableProps {
  contracts: Option<ContractInfo[]>;
  isLoading: boolean;
  emptyState: JSX.Element;
}

export const ContractsTable = ({
  contracts,
  isLoading,
  emptyState,
}: ContractsTableProps) => {
  if (isLoading) return <Loading />;
  if (!contracts?.length) return emptyState;

  const templateColumns =
    "150px minmax(250px, 1fr) 200px 150px minmax(250px, 300px) 70px";

  return (
    <TableContainer>
      <ContractsTableHeader templateColumns={templateColumns} />
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
        />
      ))}
    </TableContainer>
  );
};
