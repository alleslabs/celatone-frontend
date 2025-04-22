import type { Option, Transaction } from "lib/types";

import { useCurrentChain } from "lib/app-provider";
import { DisconnectedState } from "lib/components/state";

import { TransactionsTable } from "./TransactionsTable";

interface TransactionsTableWithWalletProps {
  emptyState: JSX.Element;
  isLoading: boolean;
  showActions: boolean;
  showRelations: boolean;
  transactions: Option<Transaction[]>;
}

export const TransactionsTableWithWallet = ({
  emptyState,
  isLoading,
  showActions,
  showRelations,
  transactions,
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
