import { MobileTableContainer, TableContainer } from "../tableComponents";
import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import type { BechAddr32, ContractInfo, Option } from "lib/types";

import { ContractsTableHeader } from "./ContractsTableHeader";
import { ContractsTableMobileCard } from "./ContractsTableMobileCard";
import { ContractsTableRow } from "./ContractsTableRow";
import type { CtaInfo } from "./ContractsTableRowCta";

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

  if (isLoading) return <Loading />;
  if (!contracts?.length) return emptyState;

  let templateColumns: string;
  if (isReadOnly)
    templateColumns = `minmax(160px, 300px) minmax(300px, 3fr) minmax(200px, 2fr)${showLastUpdate ? " 1fr" : ""}`;
  else if (!showTag)
    templateColumns = `160px minmax(300px, 3fr)${showLastUpdate ? " 250px 300px" : ""} 80px`;
  else
    templateColumns = `160px minmax(300px, 3fr) minmax(200px, 2fr)${showLastUpdate ? " 150px 260px" : ""} 80px`;

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
          onRowSelect={onRowSelect}
          showLastUpdate={showLastUpdate}
        />
      ))}
    </MobileTableContainer>
  ) : (
    <TableContainer pb={6}>
      <ContractsTableHeader
        templateColumns={templateColumns}
        showTag={showTag}
        showLastUpdate={showLastUpdate}
        isReadOnly={isReadOnly}
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
          templateColumns={templateColumns}
          onRowSelect={onRowSelect}
          showTag={showTag}
          showLastUpdate={showLastUpdate}
          isReadOnly={isReadOnly}
          withCta={withCta}
        />
      ))}
    </TableContainer>
  );
};
