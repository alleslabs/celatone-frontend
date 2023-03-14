import { Box, TableContainer } from "@chakra-ui/react";

import { Loading } from "lib/components/Loading";
import { EmptyState } from "lib/components/state";
import { TableTitle } from "lib/components/table";
import type { Delegation } from "lib/pages/account-details/data";
import type { TokenWithValue } from "lib/pages/account-details/type";
import type { Option } from "lib/types";

import { BondedTableHeader } from "./BondedTableHeader";
import { BondedTableRow } from "./BondedTableRow";
import { TEMPLATE_COLUMNS } from "./constant";

interface DelegationsTableProps {
  delegations: Option<Delegation[]>;
  rewards: Option<Record<string, TokenWithValue[]>>;
  defaultToken: TokenWithValue;
}

const DelegationsTableBody = ({
  delegations,
  rewards,
  defaultToken,
}: DelegationsTableProps) => {
  if (!delegations || !rewards) return <Loading />;
  if (!delegations.length)
    return (
      <EmptyState
        message="This account did not delegate their assets to any validators."
        withBorder
      />
    );

  return (
    <TableContainer>
      <BondedTableHeader templateColumns={TEMPLATE_COLUMNS} isDelegation />
      {delegations.map((delegation) => (
        <BondedTableRow
          key={
            delegation.validator.validatorAddress +
            delegation.token.amount +
            delegation.token.denom
          }
          bondedInfo={{
            validator: delegation.validator,
            amount: delegation.token,
            reward:
              rewards[delegation.validator.validatorAddress]?.find(
                (token) => token.denom === defaultToken.denom
              ) ?? defaultToken,
          }}
          templateColumns={TEMPLATE_COLUMNS}
        />
      ))}
    </TableContainer>
  );
};

export const DelegationsTable = ({
  delegations,
  rewards,
  defaultToken,
}: DelegationsTableProps) => (
  <Box>
    <TableTitle title="Delegated to" count={delegations?.length ?? 0} mb={2} />
    <DelegationsTableBody
      delegations={delegations}
      rewards={rewards}
      defaultToken={defaultToken}
    />
  </Box>
);
