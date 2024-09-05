import { Text } from "@chakra-ui/react";

import { LoadNext } from "lib/components/LoadNext";
import { EmptyState } from "lib/components/state";
import { TransactionsTable, ViewMore } from "lib/components/table";
import type { Option, Transaction } from "lib/types";

interface EvmContractDetailsCosmosTxsProps {
  onViewMore?: () => void;
  cosmosTxs: Option<Transaction[]>;
  isCosmosTxsLoading: boolean;
  hasNextPage: Option<boolean>;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
}

export const EvmContractDetailsCosmosTxs = ({
  onViewMore,
  cosmosTxs,
  isCosmosTxsLoading,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
}: EvmContractDetailsCosmosTxsProps) => (
  <>
    <TransactionsTable
      transactions={!onViewMore ? cosmosTxs : cosmosTxs?.slice(0, 5)}
      isLoading={isCosmosTxsLoading}
      emptyState={
        <EmptyState
          imageVariant="empty"
          message="There are no transactions on this contract."
        />
      }
      showRelations={false}
    />
    {cosmosTxs && (
      <>
        {!onViewMore && (
          <Text variant="body2" color="text.dark" mt={2}>
            {cosmosTxs?.length ?? 0} Cosmos transactions found
          </Text>
        )}
        {hasNextPage && (
          <>
            {onViewMore ? (
              <ViewMore onClick={onViewMore} />
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
