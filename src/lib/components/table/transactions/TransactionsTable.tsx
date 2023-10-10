import { Flex } from "@chakra-ui/react";

import { TableContainer } from "../tableComponents";
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
  const isMobile = useMobile();

  if (isLoading) return <Loading withBorder />;
  if (!transactions?.length) return emptyState;

  const templateColumns = `40px 190px 48px minmax(360px, 1fr) ${
    showRelations ? "100px " : ""
  }max(190px) ${showTimestamp ? "max(230px) " : ""}${
    showAction ? "100px " : ""
  }`;

  return isMobile ? (
    <Flex direction="column" gap={4} w="full" mt={4}>
      {transactions.map((transaction) => (
        <TransactionsTableMobileCard
          key={transaction.hash}
          transaction={transaction}
        />
      ))}
    </Flex>
  ) : (
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
