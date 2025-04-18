import type { HexAddr32 } from "lib/types";

import { LoadNext } from "lib/components/LoadNext";
import { EmptyState } from "lib/components/state";
import { useNftTransactionsSequencer } from "lib/services/nft";

import { TxsTable } from "./TxsTable";

interface TxsSequencerProps {
  nftAddress: HexAddr32;
}

export const TxsSequencer = ({ nftAddress }: TxsSequencerProps) => {
  const {
    data: transactions,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useNftTransactionsSequencer(nftAddress);

  return (
    <>
      <TxsTable
        emptyState={
          <EmptyState imageVariant="empty" message="Transactions not found." />
        }
        isLoading={isLoading}
        txs={transactions}
      />
      {hasNextPage && (
        <LoadNext
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
          text="Load more transactions"
        />
      )}
    </>
  );
};
