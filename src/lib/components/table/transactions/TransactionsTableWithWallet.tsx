import { useCurrentChain } from "lib/app-provider";
import { DisconnectedState } from "lib/components/state";
import type { Option, Transaction } from "lib/types";

import { TransactionsTable } from "./TransactionsTable";

interface TransactionsTableWithWalletProps {
  transactions: Option<Transaction[]>;
  isLoading: boolean;
  emptyState: JSX.Element;
}

export const TransactionsTableWithWallet = ({
  transactions,
  isLoading,
  emptyState,
}: TransactionsTableWithWalletProps) => {
  const { address } = useCurrentChain();
  return !address ? (
    <DisconnectedState
      text="to see your past transactions."
      helperText="Past transactions will display here."
    />
  ) : (
    <TransactionsTable
      transactions={transactions}
      isLoading={isLoading}
      emptyState={emptyState}
      showAction
      showRelations
    />
  );
};
