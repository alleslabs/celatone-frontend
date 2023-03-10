import { TableContainer } from "@chakra-ui/react";

import type { NonRedelegatable } from "lib/pages/account-details/type";

import { NonRedelegatableTableHeader } from "./NonRedelegatableTableHeader";
import { NonRedelegatableTableRow } from "./NonRedelegatableTableRow";

const TEMPLATE_COLUMNS = "minmax(300px, 1fr) 2fr";

interface NonRedelegatablesTableProps {
  nonRedelegatables: NonRedelegatable[];
}

export const NonRedelegatablesTable = ({
  nonRedelegatables,
}: NonRedelegatablesTableProps) => (
  <TableContainer>
    <NonRedelegatableTableHeader templateColumns={TEMPLATE_COLUMNS} />
    {nonRedelegatables.map((nonRedelegatable) => (
      <NonRedelegatableTableRow
        key={`nonredelegatable_${nonRedelegatable.validator.validatorAddress}_${nonRedelegatable.validator.moniker}`}
        nonRedelegatable={nonRedelegatable}
        templateColumns={TEMPLATE_COLUMNS}
      />
    ))}
  </TableContainer>
);
