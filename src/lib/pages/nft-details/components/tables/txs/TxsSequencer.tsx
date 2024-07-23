import { EmptyState } from "lib/components/state";
import { useNftTransactionsSequencer } from "lib/services/nft";
import type { HexAddr32 } from "lib/types";

import { TxsTable } from "./TxsTable";

interface TxsSequencerProps {
  nftAddress: HexAddr32;
}

export const TxsSequencer = ({ nftAddress }: TxsSequencerProps) => {
  const { data: transactions, isLoading } =
    useNftTransactionsSequencer(nftAddress);

  return (
    <TxsTable
      txs={transactions}
      isLoading={isLoading}
      emptyState={
        <EmptyState imageVariant="empty" message="Transactions not found." />
      }
    />
  );
};
