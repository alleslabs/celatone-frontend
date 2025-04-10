import type { Redelegation } from "lib/types";

import { TableContainer } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";

import { MobileTableContainer } from "../tableComponents";
import { RedelegationTableHeader } from "./RedelegationTableHeader";
import { RedelegationTableMobileCard } from "./RedelegationTableMobileCard";
import { RedelegationTableRow } from "./RedelegationTableRow";

const TEMPLATE_COLUMNS =
  "minmax(250px, 300px) 50px minmax(250px, 300px) minmax(300px, 1fr) minmax(250px, 1fr)";

interface RedelegationsTableProps {
  redelegations: Redelegation[];
}

export const RedelegationsTable = ({
  redelegations,
}: RedelegationsTableProps) => {
  const isMobile = useMobile();
  return isMobile ? (
    <MobileTableContainer mt={0}>
      {redelegations.map((redelegation) => (
        <RedelegationTableMobileCard
          key={
            redelegation.srcValidator.validatorAddress +
            redelegation.dstValidator.validatorAddress +
            redelegation.balances.reduce(
              (prev, balance) => prev + balance.amount + balance.denom,
              ""
            ) +
            redelegation.completionTime
          }
          redelegation={redelegation}
        />
      ))}
    </MobileTableContainer>
  ) : (
    <TableContainer>
      <RedelegationTableHeader templateColumns={TEMPLATE_COLUMNS} />
      {redelegations.map((redelegation) => (
        <RedelegationTableRow
          key={
            redelegation.srcValidator.validatorAddress +
            redelegation.dstValidator.validatorAddress +
            redelegation.balances.reduce(
              (prev, balance) => prev + balance.amount + balance.denom,
              ""
            ) +
            redelegation.completionTime
          }
          redelegation={redelegation}
          templateColumns={TEMPLATE_COLUMNS}
        />
      ))}
    </TableContainer>
  );
};
