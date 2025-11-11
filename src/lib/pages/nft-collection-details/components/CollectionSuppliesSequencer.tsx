import type { HexAddr32 } from "lib/types";

import { Box } from "@chakra-ui/react";
import { LoadNext } from "lib/components/LoadNext";
import { NftList } from "lib/components/nft";
import { EmptyState, ErrorFetching } from "lib/components/state";
import { useNftsSequencer } from "lib/services/nft";

interface CollectionSuppliesSequencerProps {
  collectionAddress: HexAddr32;
}

export const CollectionSuppliesSequencer = ({
  collectionAddress,
}: CollectionSuppliesSequencerProps) => {
  const {
    data: nfts,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useNftsSequencer(collectionAddress, 10, true);

  return (
    <Box gap="40px" mt="32px">
      <NftList
        emptyState={
          error ? (
            <ErrorFetching dataName="NFTs" />
          ) : (
            <EmptyState
              imageVariant="not-found"
              message="There are no NFTs matches your keyword."
              withBorder
            />
          )
        }
        isLoading={isLoading}
        nfts={nfts}
        showCollection={false}
      />
      {hasNextPage && (
        <LoadNext
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
          text="Load more NFTs"
        />
      )}
    </Box>
  );
};
