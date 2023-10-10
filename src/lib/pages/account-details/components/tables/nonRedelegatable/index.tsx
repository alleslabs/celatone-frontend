import { Flex, TableContainer } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import type { NonRedelegatable } from "lib/pages/account-details/type";

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
    <Flex>
      {nonRedelegatables.map((nonRedelegatable) => (
        <NonRedelegatablesTableMobileCard
          key={`nonredelegatable_${nonRedelegatable.dstValidator.validatorAddress}_${nonRedelegatable.dstValidator.moniker}`}
          nonRedelegatable={nonRedelegatable}
        />
      ))}
    </Flex>
  ) : (
    <TableContainer>
      <NonRedelegatableTableHeader templateColumns={TEMPLATE_COLUMNS} />
      {nonRedelegatables.map((nonRedelegatable) => (
        <NonRedelegatableTableRow
          key={`nonredelegatable_${nonRedelegatable.dstValidator.validatorAddress}_${nonRedelegatable.dstValidator.moniker}`}
          nonRedelegatable={nonRedelegatable}
          templateColumns={TEMPLATE_COLUMNS}
        />
      ))}
    </TableContainer>
  );
};
