import type { Option, Transaction } from "lib/types";

import { useCurrentChain } from "lib/app-provider";
import { DisconnectedState } from "lib/components/state";
import { JSX } from "react";

import { TransactionsTable } from "./TransactionsTable";

interface TransactionsTableWithWalletProps {
  transactions: Option<Transaction[]>;
  isLoading: boolean;
  emptyState: JSX.Element;
  showActions: boolean;
  showRelations: boolean;
}

export const TransactionsTableWithWallet = ({
  transactions,
  isLoading,
  emptyState,
  showActions,
  showRelations,
}: TransactionsTableWithWalletProps) => {
  const { address } = useCurrentChain();
  return !address ? (
    <DisconnectedState
      helperText="Past transactions will display here."
      text="to see your past transactions."
    />
  ) : (
    <TransactionsTable
      emptyState={emptyState}
      isLoading={isLoading}
      showAction={showActions}
      showRelations={showRelations}
      transactions={transactions}
    />
  );
};
