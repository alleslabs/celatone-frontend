import { Box } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { EmptyState, ErrorFetching } from "lib/components/state";
import type { Option, Unbonding } from "lib/types";

import { BondedTableHeader } from "./BondedTableHeader";
import { BondedTableMobileCard } from "./BondedTableMobileCard";
import { BondedTableRow } from "./BondedTableRow";
import { TEMPLATE_COLUMNS } from "./constants";
import { MobileTableContainer, TableContainer } from "../tableComponents";
import { TableTitle } from "../TableTitle";

interface UnbondingsTableProps {
  unbondings: Option<Unbonding[]>;
  isLoading: boolean;
  isSingleBondDenom: boolean;
}

const UnbondingsTableBody = ({
  unbondings,
  isLoading,
  isSingleBondDenom,
}: UnbondingsTableProps) => {
  const isMobile = useMobile();

  if (isLoading) return <Loading />;
  if (!unbondings) return <ErrorFetching dataName="undelegations" />;
  if (!unbondings.length)
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
            unbonding.balances.reduce(
              (prev, balance) => prev + balance.amount + balance.denom,
              ""
            ) +
            unbonding.completionTime
          }
          bondedInfo={{
            validator: unbonding.validator,
            balances: unbonding.balances,
            completionTime: unbonding.completionTime,
          }}
          isSingleBondDenom={isSingleBondDenom}
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
            unbonding.balances.reduce(
              (prev, balance) => prev + balance.amount + balance.denom,
              ""
            ) +
            unbonding.completionTime
          }
          bondedInfo={{
            validator: unbonding.validator,
            balances: unbonding.balances,
            completionTime: unbonding.completionTime,
          }}
          isSingleBondDenom={isSingleBondDenom}
          templateColumns={TEMPLATE_COLUMNS}
          isUnbonding
        />
      ))}
    </TableContainer>
  );
};

export const UnbondingsTable = ({
  unbondings,
  isLoading,
  isSingleBondDenom,
}: UnbondingsTableProps) => (
  <Box width="100%">
    <TableTitle title="Unbonding" count={unbondings?.length ?? 0} mb={2} />
    <UnbondingsTableBody
      unbondings={unbondings}
      isLoading={isLoading}
      isSingleBondDenom={isSingleBondDenom}
    />
  </Box>
);
