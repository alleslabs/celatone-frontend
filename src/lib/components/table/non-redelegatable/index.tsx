import type { NonRedelegatable } from "lib/types";

import { useMobile } from "lib/app-provider";

import { MobileTableContainer, TableContainer } from "../tableComponents";
import { NonRedelegatableTableHeader } from "./NonRedelegatableTableHeader";
import { NonRedelegatablesTableMobileCard } from "./NonRedelegatableTableMobileCard";
import { NonRedelegatableTableRow } from "./NonRedelegatableTableRow";

const TEMPLATE_COLUMNS = "minmax(300px, 1fr) 2fr";

interface NonRedelegatablesTableProps {
  nonRedelegatables: NonRedelegatable[];
}

export const NonRedelegatablesTable = ({
  nonRedelegatables,
}: NonRedelegatablesTableProps) => {
  const isMobile = useMobile();
  return isMobile ? (
    <MobileTableContainer mt={0}>
      {nonRedelegatables.map((nonRedelegatable) => (
        <NonRedelegatablesTableMobileCard
          key={`non_redelegatable_${nonRedelegatable.dstValidator.validatorAddress}_${nonRedelegatable.dstValidator.moniker}`}
          nonRedelegatable={nonRedelegatable}
        />
      ))}
    </MobileTableContainer>
  ) : (
    <TableContainer>
      <NonRedelegatableTableHeader templateColumns={TEMPLATE_COLUMNS} />
      {nonRedelegatables.map((nonRedelegatable) => (
        <NonRedelegatableTableRow
          key={`non_redelegatable_${nonRedelegatable.dstValidator.validatorAddress}_${nonRedelegatable.dstValidator.moniker}`}
          nonRedelegatable={nonRedelegatable}
          templateColumns={TEMPLATE_COLUMNS}
        />
      ))}
    </TableContainer>
  );
};
