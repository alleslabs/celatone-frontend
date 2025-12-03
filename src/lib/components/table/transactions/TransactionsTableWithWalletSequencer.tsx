import type { CosmosTxsProps } from "lib/components/cosmos-evm-txs/CosmosTxs";
import type { EvmTxsProps } from "lib/components/cosmos-evm-txs/EvmTxs";

import { useCurrentChain, useEvmConfig } from "lib/app-provider";
import { LoadNext } from "lib/components/LoadNext";
import { DisconnectedState } from "lib/components/state";
import { CosmosEvmTxsTab } from "lib/hooks";

import { EvmTransactionsTable } from "../evm-transactions";
import { TransactionsTable } from "./TransactionsTable";

interface TransactionsTableWithWalletSequencerProps {
  cosmosData: CosmosTxsProps;
  currentTab?: CosmosEvmTxsTab;
  evmData?: EvmTxsProps;
}

export const TransactionsTableWithWalletSequencer = ({
  cosmosData,
  currentTab,
  evmData,
}: TransactionsTableWithWalletSequencerProps) => {
  const { address } = useCurrentChain();
  const evm = useEvmConfig({ shouldRedirect: false });

  if (!address)
    return (
      <DisconnectedState
        helperText="Past transactions will display here."
        text="to see your past transactions."
      />
    );

  if (evm.enabled && evmData && currentTab === CosmosEvmTxsTab.Evm) {
    return (
      <>
        <EvmTransactionsTable
          emptyState={evmData.emptyEvmMessage}
          evmTransactions={
            evmData.evmTxsData.data?.pages.flatMap((page) => page.txs) ?? []
          }
          isLoading={
            evmData.evmTxsData.isLoading ||
            (evmData.evmTxsData.isFetching &&
              !evmData.evmTxsData.isFetchingNextPage)
          }
          showTimestamp
        />
        {evmData.evmTxsData.hasNextPage && (
          <LoadNext
            fetchNextPage={evmData.evmTxsData.fetchNextPage}
            isFetchingNextPage={evmData.evmTxsData.isFetchingNextPage}
            text="Load more transactions"
          />
        )}
      </>
    );
  }

  return (
    <>
      <TransactionsTable
        emptyState={cosmosData.emptyMessage}
        isLoading={cosmosData.data.isLoading}
        showAction={false}
        showRelations={false}
        transactions={
          cosmosData.data.data?.pages.flatMap((page) => page.items) ?? []
        }
      />
      {cosmosData.data.hasNextPage && (
        <LoadNext
          fetchNextPage={cosmosData.data.fetchNextPage}
          isFetchingNextPage={cosmosData.data.isFetchingNextPage}
          text="Load more transactions"
        />
      )}
    </>
  );
};
