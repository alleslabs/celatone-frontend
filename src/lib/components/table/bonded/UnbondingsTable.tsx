import type { Option, Unbonding } from "lib/types";

import { Box } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { EmptyState, ErrorFetching } from "lib/components/state";

import { MobileTableContainer, TableContainer } from "../tableComponents";
import { TableTitle } from "../TableTitle";
import { BondedTableHeader } from "./BondedTableHeader";
import { BondedTableMobileCard } from "./BondedTableMobileCard";
import { BondedTableRow } from "./BondedTableRow";
import { TEMPLATE_COLUMNS } from "./constants";

interface UnbondingsTableProps {
  isLoading: boolean;
  isSingleBondDenom: boolean;
  unbondings: Option<Unbonding[]>;
}

const UnbondingsTableBody = ({
  isLoading,
  isSingleBondDenom,
  unbondings,
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
            balances: unbonding.balances,
            completionTime: unbonding.completionTime,
            validator: unbonding.validator,
          }}
          isSingleBondDenom={isSingleBondDenom}
        />
      ))}
    </MobileTableContainer>
  ) : (
    <TableContainer>
      <BondedTableHeader
        isDelegation={false}
        templateColumns={TEMPLATE_COLUMNS}
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
            balances: unbonding.balances,
            completionTime: unbonding.completionTime,
            validator: unbonding.validator,
          }}
          isSingleBondDenom={isSingleBondDenom}
          isUnbonding
          templateColumns={TEMPLATE_COLUMNS}
        />
      ))}
    </TableContainer>
  );
};

export const UnbondingsTable = ({
  isLoading,
  isSingleBondDenom,
  unbondings,
}: UnbondingsTableProps) => (
  <Box width="100%">
    <TableTitle count={unbondings?.length ?? 0} mb={2} title="Unbonding" />
    <UnbondingsTableBody
      isLoading={isLoading}
      isSingleBondDenom={isSingleBondDenom}
      unbondings={unbondings}
    />
  </Box>
);
