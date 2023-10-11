import { Box } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { EmptyState } from "lib/components/state";
import {
  MobileTableContainer,
  TableContainer,
  TableTitle,
} from "lib/components/table";
import type { Unbonding } from "lib/pages/account-details/data";
import type { Option } from "lib/types";

import { BondedTableHeader } from "./BondedTableHeader";
import { BondedTableMobileCard } from "./BondedTableMobileCard";
import { BondedTableRow } from "./BondedTableRow";
import { TEMPLATE_COLUMNS } from "./constants";

interface UnbondingsTableProps {
  unbondings: Option<Unbonding[]>;
  isLoading: boolean;
}

const UnbondingsTableBody = ({
  unbondings,
  isLoading,
}: UnbondingsTableProps) => {
  const isMobile = useMobile();

  if (isLoading) return <Loading withBorder />;
  if (!unbondings?.length)
    return (
      <EmptyState
        message="This account does not have any assets that is currently unbonding."
        withBorder
      />
    );

  return isMobile ? (
    <MobileTableContainer mt={0}>
      {unbondings.map((unbonding) => (
        <BondedTableMobileCard
          key={
            unbonding.validator.validatorAddress +
            unbonding.token.amount +
            unbonding.token.denom +
            unbonding.completionTime
          }
          bondedInfo={{
            validator: unbonding.validator,
            amount: unbonding.token,
            completionTime: unbonding.completionTime,
          }}
        />
      ))}
    </MobileTableContainer>
  ) : (
    <TableContainer>
      <BondedTableHeader
        templateColumns={TEMPLATE_COLUMNS}
        isDelegation={false}
      />
      {unbondings.map((unbonding) => (
        <BondedTableRow
          key={
            unbonding.validator.validatorAddress +
            unbonding.token.amount +
            unbonding.token.denom +
            unbonding.completionTime
          }
          bondedInfo={{
            validator: unbonding.validator,
            amount: unbonding.token,
            completionTime: unbonding.completionTime,
          }}
          templateColumns={TEMPLATE_COLUMNS}
        />
      ))}
    </TableContainer>
  );
};

export const UnbondingsTable = ({
  unbondings,
  isLoading,
}: UnbondingsTableProps) => (
  <Box width="100%">
    <TableTitle title="Unbonding" count={unbondings?.length ?? 0} mb={2} />
    <UnbondingsTableBody unbondings={unbondings} isLoading={isLoading} />
  </Box>
);
