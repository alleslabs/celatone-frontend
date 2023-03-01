import { TableContainer } from "@chakra-ui/react";

import { Loading } from "lib/components/Loading";
import type { Option, Transaction } from "lib/types";

import { TransactionsTableHeader } from "./TransactionsTableHeader";
import { TransactionsTableRow } from "./TransactionsTableRow";

interface TransactionsTableProps {
  transactions: Option<Transaction[]>;
  isLoading: boolean;
  emptyState: JSX.Element;
}

export const TransactionsTable = ({
  transactions,
  isLoading,
  emptyState,
}: TransactionsTableProps) => {
  if (isLoading) return <Loading />;
  if (!transactions?.length) return emptyState;

  const templateColumns =
    "180px 70px minmax(360px, 1fr) max(170px) max(250px) max(70px)";

  return (
    <TableContainer>
      <TransactionsTableHeader templateColumns={templateColumns} showSender />
      {transactions.map((transaction) => (
        <TransactionsTableRow
          key={transaction.hash}
          transaction={transaction}
          templateColumns={templateColumns}
          showSender
        />
      ))}
    </TableContainer>
  );
};
