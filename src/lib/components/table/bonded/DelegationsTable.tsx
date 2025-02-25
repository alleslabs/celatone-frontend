import { Box } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { EmptyState, ErrorFetching } from "lib/components/state";
import type { Delegation, Option, TokenWithValue } from "lib/types";

import { BondedTableHeader } from "./BondedTableHeader";
import { BondedTableMobileCard } from "./BondedTableMobileCard";
import { BondedTableRow } from "./BondedTableRow";
import { TEMPLATE_COLUMNS } from "./constants";
import { MobileTableContainer, TableContainer } from "../tableComponents";
import { TableTitle } from "../TableTitle";

interface DelegationsTableProps {
  delegations: Option<Delegation[]>;
  rewards: Option<Record<string, TokenWithValue[]>>;
  isLoading: boolean;
  isSingleBondDenom: boolean;
}

const DelegationsTableBody = ({
  delegations,
  rewards,
  isLoading,
  isSingleBondDenom,
}: DelegationsTableProps) => {
  const isMobile = useMobile();

  if (isLoading) return <Loading />;
  if (!delegations || !rewards) return <ErrorFetching dataName="delegations" />;
  if (!delegations.length)
    return (
      <EmptyState
        message="This account did not delegate their assets to any validators."
        withBorder
      />
    );

  return isMobile ? (
    <MobileTableContainer mt={0}>
      {delegations.map((delegation) => (
        <BondedTableMobileCard
          key={
            delegation.validator.validatorAddress +
            delegation.balances.reduce(
              (prev, balance) => prev + balance.amount + balance.denom,
              ""
            )
          }
          bondedInfo={{
            validator: delegation.validator,
            balances: delegation.balances,
            rewards: rewards[delegation.validator.validatorAddress] ?? [],
          }}
          isSingleBondDenom={isSingleBondDenom}
        />
      ))}
    </MobileTableContainer>
  ) : (
    <TableContainer>
      <BondedTableHeader templateColumns={TEMPLATE_COLUMNS} isDelegation />
      {delegations.map((delegation) => (
        <BondedTableRow
          key={
            delegation.validator.validatorAddress +
            delegation.balances.reduce(
              (prev, balance) => prev + balance.amount + balance.denom,
              ""
            )
          }
          bondedInfo={{
            validator: delegation.validator,
            balances: delegation.balances,
            rewards: rewards[delegation.validator.validatorAddress] ?? [],
          }}
          isSingleBondDenom={isSingleBondDenom}
          templateColumns={TEMPLATE_COLUMNS}
        />
      ))}
    </TableContainer>
  );
};

export const DelegationsTable = ({
  delegations,
  rewards,
  isLoading,
  isSingleBondDenom,
}: DelegationsTableProps) => (
  <Box width="100%">
    <TableTitle title="Delegated to" count={delegations?.length ?? 0} mb={2} />
    <DelegationsTableBody
      delegations={delegations}
      rewards={rewards}
      isLoading={isLoading}
      isSingleBondDenom={isSingleBondDenom}
    />
  </Box>
);
