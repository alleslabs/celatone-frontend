import { Grid } from "@chakra-ui/react";

import { TableRow } from "../tableComponents";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { BechAddr32, ContractInfo } from "lib/types";

import { ContractInstantiatorCell } from "./ContractInstantiatorCell";
import { ContractNameCell } from "./ContractNameCell";
import type { CTAInfo } from "./ContractsTableRowCTA";
import { ContractsTableRowCTA } from "./ContractsTableRowCTA";
import { TagsCell } from "./TagsCell";

interface ContractsTableRowProps {
  contractInfo: ContractInfo;
  templateColumns: string;
  onRowSelect: (contract: BechAddr32) => void;
  showTag: boolean;
  showLastUpdate: boolean;
  isReadOnly: boolean;
  withCTA?: CTAInfo;
}

export const ContractsTableRow = ({
  contractInfo,
  templateColumns,
  onRowSelect,
  showTag,
  showLastUpdate,
  isReadOnly,
  withCTA,
}: ContractsTableRowProps) => (
  <Grid
    templateColumns={templateColumns}
    onClick={() => onRowSelect(contractInfo.contractAddress)}
    _hover={{ bg: "gray.900" }}
    transition="all 0.25s ease-in-out"
    cursor="pointer"
    minW="min-content"
  >
    <TableRow>
      <ExplorerLink
        value={contractInfo.contractAddress}
        type="contract_address"
        showCopyOnHover
        isReadOnly={isReadOnly}
      />
    </TableRow>

    <TableRow>
      <ContractNameCell
        contractLocalInfo={contractInfo}
        isReadOnly={isReadOnly}
      />
    </TableRow>

    {showTag && (
      <TableRow>
        <TagsCell contractLocalInfo={contractInfo} isReadOnly={isReadOnly} />
      </TableRow>
    )}

    {showLastUpdate && (
      <TableRow>
        <ContractInstantiatorCell
          contractInfo={contractInfo}
          isReadOnly={isReadOnly}
        />
      </TableRow>
    )}

    {!isReadOnly && (
      <ContractsTableRowCTA
        contractInfo={contractInfo}
        withCTA={withCTA}
        showLastUpdate={showLastUpdate}
      />
    )}
  </Grid>
);
