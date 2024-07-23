import { Grid } from "@chakra-ui/react";

import { TableRow } from "../tableComponents";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { BechAddr32, ContractInfo } from "lib/types";

import { ContractInstantiatorCell } from "./ContractInstantiatorCell";
import { ContractNameCell } from "./ContractNameCell";
import type { CtaInfo } from "./ContractsTableRowCta";
import { ContractsTableRowCta } from "./ContractsTableRowCta";
import { TagsCell } from "./TagsCell";

interface ContractsTableRowProps {
  contractInfo: ContractInfo;
  templateColumns: string;
  onRowSelect: (contract: BechAddr32) => void;
  showTag: boolean;
  showLastUpdate: boolean;
  isReadOnly: boolean;
  withCta?: CtaInfo;
}

export const ContractsTableRow = ({
  contractInfo,
  templateColumns,
  onRowSelect,
  showTag,
  showLastUpdate,
  isReadOnly,
  withCta,
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
      <ContractsTableRowCta
        contractInfo={contractInfo}
        withCta={withCta}
        showLastUpdate={showLastUpdate}
      />
    )}
  </Grid>
);
