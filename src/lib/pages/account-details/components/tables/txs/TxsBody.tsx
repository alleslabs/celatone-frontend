import { Flex } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { TransactionCard } from "lib/components/card/TransactionCard";
import { Loading } from "lib/components/Loading";
import { TransactionsTable } from "lib/components/table";
import type { Option, Transaction } from "lib/types";

interface TxsBodyProps {
  transactions: Option<Transaction[]>;
  isLoading: boolean;
  emptyState: JSX.Element;
  showRelations: boolean;
  onViewMore?: () => void;
}

export const TxsBody = ({
  transactions,
  isLoading,
  emptyState,
  showRelations,
  onViewMore,
}: TxsBodyProps) => {
  const isMobile = useMobile();
  if (isLoading) return <Loading />;
  if (!transactions?.length) return emptyState;
  if (isMobile && !onViewMore)
    return (
      <Flex direction="column" gap={4} w="full" mt={4}>
        {transactions.map((transaction) => (
          <TransactionCard transaction={transaction} key={transaction.hash} />
        ))}
      </Flex>
    );
  if (isMobile && onViewMore) return null;
  return (
    <TransactionsTable
      transactions={transactions}
      isLoading={isLoading}
      emptyState={emptyState}
      showRelations={showRelations}
    />
  );
};
