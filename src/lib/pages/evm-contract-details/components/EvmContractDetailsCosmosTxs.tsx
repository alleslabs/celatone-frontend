import { Text } from "@chakra-ui/react";

import { TxsTabIndex } from "../types";
import { LoadNext } from "lib/components/LoadNext";
import { EmptyState } from "lib/components/state";
import { TransactionsTable, ViewMore } from "lib/components/table";
import type { Option, Transaction } from "lib/types";

interface EvmContractDetailsCosmosTxsProps {
  onViewMore?: (tabIndex: TxsTabIndex) => void;
  txsData: Option<Transaction[]>;
  isTxsLoading: boolean;
  hasNextPage: Option<boolean>;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
}

export const EvmContractDetailsCosmosTxs = ({
  onViewMore,
  txsData,
  isTxsLoading,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
}: EvmContractDetailsCosmosTxsProps) => (
  <>
    <TransactionsTable
      transactions={!onViewMore ? txsData : txsData?.slice(0, 5)}
      isLoading={isTxsLoading}
      emptyState={
        <EmptyState
          imageVariant="empty"
          message="There are no transactions on this contract."
        />
      }
      showRelations={false}
    />
    {txsData && (
      <>
        {!onViewMore && (
          <Text variant="body2" color="text.dark" mt={2}>
            {txsData?.length ?? 0} Cosmos transactions found
          </Text>
        )}
        {hasNextPage && (
          <>
            {onViewMore ? (
              <ViewMore onClick={() => onViewMore(TxsTabIndex.Cosmos)} />
            ) : (
              <LoadNext
                text="Load more 10 transactions"
                fetchNextPage={fetchNextPage}
                isFetchingNextPage={isFetchingNextPage}
              />
            )}
          </>
        )}
      </>
    )}
  </>
);
