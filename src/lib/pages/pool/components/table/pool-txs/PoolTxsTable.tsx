import { TableContainer } from "@chakra-ui/react";

import { Loading } from "lib/components/Loading";
import type { Option, Transaction } from "lib/types";

import { PoolTxsTableHeader } from "./PoolTxsTableHeader";
import { PoolTxsTableMultiRow } from "./PoolTxsTableMultiRow";

interface PoolTxsTableProps {
  transactions: Option<Transaction[]>;
  isLoading: boolean;
  emptyState: JSX.Element;
}

export const PoolTxsTable = ({
  transactions,
  isLoading,
  emptyState,
}: PoolTxsTableProps) => {
  if (isLoading) return <Loading />;
  if (!transactions?.length) return emptyState;

  const templateColumns = "200px minmax(360px, 1fr) max(150px) max(220px) 60px";

  return (
    <TableContainer>
      <PoolTxsTableHeader templateColumns={templateColumns} />
      {transactions.map((transaction) => (
        <PoolTxsTableMultiRow
          key={transaction.hash}
          transaction={transaction}
          templateColumns={templateColumns}
        />
      ))}
    </TableContainer>
  );
};
