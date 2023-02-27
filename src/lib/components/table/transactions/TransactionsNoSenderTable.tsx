import { TableContainer } from "@chakra-ui/react";

import { Loading } from "lib/components/Loading";
import type { Option, Transaction } from "lib/types";

import { TransactionsTableHeader } from "./TransactionsTableHeader";
import { TransactionsTableRow } from "./TransactionsTableRow";

interface TransactionsNoSenderTableProps {
  transactions: Option<Transaction[]>;
  isLoading: boolean;
  emptyState: JSX.Element;
}

export const TransactionsNoSenderTable = ({
  transactions,
  isLoading,
  emptyState,
}: TransactionsNoSenderTableProps) => {
  if (isLoading) return <Loading />;
  if (!transactions?.length) return emptyState;

  const templateColumns = "180px 70px minmax(360px, 1fr) max(250px) max(70px)";

  return (
    <TableContainer>
      <TransactionsTableHeader
        templateColumns={templateColumns}
        showSender={false}
      />
      {transactions.map((transaction) => (
        <TransactionsTableRow
          key={transaction.hash}
          transaction={transaction}
          templateColumns={templateColumns}
          showSender={false}
        />
      ))}
    </TableContainer>
  );
};
