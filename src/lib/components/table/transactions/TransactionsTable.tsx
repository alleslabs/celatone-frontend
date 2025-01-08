import { MobileTableContainer, TableContainer } from "../tableComponents";
import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import type { Option, Transaction } from "lib/types";

import { TransactionsTableHeader } from "./TransactionsTableHeader";
import { TransactionsTableMobileCard } from "./TransactionsTableMobileCard";
import { TransactionsTableRow } from "./TransactionsTableRow";

interface TransactionsTableProps {
  transactions: Option<Transaction[]>;
  isLoading: boolean;
  emptyState: JSX.Element;
  showSuccess?: boolean;
  showRelations: boolean;
  showTimestamp?: boolean;
  showAction?: boolean;
}

export const TransactionsTable = ({
  transactions,
  isLoading,
  emptyState,
  showSuccess = true,
  showRelations,
  showTimestamp = true,
  showAction = false,
}: TransactionsTableProps) => {
  const isMobile = useMobile();

  if (isLoading) return <Loading />;
  if (!transactions?.length) return emptyState;

  const columns: string[] = [
    "32px",
    "190px",
    ...(showSuccess ? ["48px"] : []),
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
          transaction={transaction}
          showSuccess={showSuccess}
          showRelations={showRelations}
          showTimestamp={showTimestamp}
        />
      ))}
    </MobileTableContainer>
  ) : (
    <TableContainer>
      <TransactionsTableHeader
        templateColumns={templateColumns}
        showSuccess={showSuccess}
        showRelations={showRelations}
        showTimestamp={showTimestamp}
        showAction={showAction}
      />
      {transactions.map((transaction) => (
        <TransactionsTableRow
          key={transaction.hash}
          transaction={transaction}
          templateColumns={templateColumns}
          showSuccess={showSuccess}
          showRelations={showRelations}
          showTimestamp={showTimestamp}
          showAction={showAction}
        />
      ))}
    </TableContainer>
  );
};
