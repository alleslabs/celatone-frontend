import { TableContainer } from "../tableComponents";
import { Loading } from "lib/components/Loading";
import type { Option, Transaction } from "lib/types";

import { TransactionsTableHeader } from "./TransactionsTableHeader";
import { TransactionsTableRow } from "./TransactionsTableRow";

interface TransactionsTableProps {
  transactions: Option<Transaction[]>;
  isLoading: boolean;
  emptyState: JSX.Element;
  showRelations: boolean;
  showTimestamp?: boolean;
  showAction?: boolean;
}

export const TransactionsTable = ({
  transactions,
  isLoading,
  emptyState,
  showRelations,
  showTimestamp = true,
  showAction = false,
}: TransactionsTableProps) => {
  if (isLoading) return <Loading />;
  if (!transactions?.length) return emptyState;

  const templateColumns = `25px 180px 40px minmax(360px, 1fr) ${
    showRelations ? "100px " : ""
  }max(160px) ${showTimestamp ? "max(220px) " : ""}${
    showAction ? "100px " : ""
  }`;

  return (
    <TableContainer>
      <TransactionsTableHeader
        templateColumns={templateColumns}
        showRelations={showRelations}
        showTimestamp={showTimestamp}
        showAction={showAction}
      />
      {transactions.map((transaction) => (
        <TransactionsTableRow
          key={transaction.hash}
          transaction={transaction}
          templateColumns={templateColumns}
          showRelations={showRelations}
          showTimestamp={showTimestamp}
          showAction={showAction}
        />
      ))}
    </TableContainer>
  );
};
