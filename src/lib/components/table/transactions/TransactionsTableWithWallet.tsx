import { Flex } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";

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
  const { address } = useWallet();
  return !address ? (
    <Flex direction="column" py="48px" borderColor="pebble.700">
      <DisconnectedState
        text="to see your past transactions."
        helperText="Past transactions involving the Wasm module (storing wasm codes, contract interactions, etc.) will display here."
      />
    </Flex>
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
