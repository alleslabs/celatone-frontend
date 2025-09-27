import type { Option, TransactionWithTxResponse } from "lib/types";
import type { ReactNode } from "react";

import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";

import { MobileTableContainer, TableContainer } from "../tableComponents";
import { TransactionsTableHeader } from "./TransactionsTableHeader";
import { TransactionsTableMobileCard } from "./TransactionsTableMobileCard";
import { TransactionsTableRow } from "./TransactionsTableRow";

interface TransactionsTableProps {
  emptyState: ReactNode;
  isLoading: boolean;
  showAction?: boolean;
  showRelations: boolean;
  showSuccess?: boolean;
  showTimestamp?: boolean;
  transactions: Option<TransactionWithTxResponse[]>;
}

export const TransactionsTable = ({
  emptyState,
  isLoading,
  showAction = false,
  showRelations,
  showSuccess = true,
  showTimestamp = true,
  transactions,
}: TransactionsTableProps) => {
  const isMobile = useMobile();

  if (isLoading) return <Loading />;
  if (!transactions?.length) return emptyState;

  const columns: string[] = [
    "32px",
    "190px",
    "minmax(380px, 1fr)",
    ...(showRelations ? ["90px"] : []),
    "max(180px)",
    ...(showTimestamp ? ["max(228px)"] : []),
    ...(showAction ? ["100px"] : []),
  ];
  const templateColumns: string = columns.join(" ");

  return isMobile ? (
    <MobileTableContainer>
      {transactions.map((transaction) => (
        <TransactionsTableMobileCard
          key={transaction.hash}
          showRelations={showRelations}
          showSuccess={showSuccess}
          showTimestamp={showTimestamp}
          transaction={transaction}
        />
      ))}
    </MobileTableContainer>
  ) : (
    <TableContainer>
      <TransactionsTableHeader
        showAction={showAction}
        showRelations={showRelations}
        showTimestamp={showTimestamp}
        templateColumns={templateColumns}
      />
      {transactions.map((transaction) => (
        <TransactionsTableRow
          key={transaction.hash}
          showAction={showAction}
          showRelations={showRelations}
          showSuccess={showSuccess}
          showTimestamp={showTimestamp}
          templateColumns={templateColumns}
          transaction={transaction}
        />
      ))}
    </TableContainer>
  );
};
