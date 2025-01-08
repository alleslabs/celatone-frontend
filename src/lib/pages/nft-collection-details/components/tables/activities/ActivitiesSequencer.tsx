import { Heading, Stack } from "@chakra-ui/react";

import { LoadNext } from "lib/components/LoadNext";
import { EmptyState } from "lib/components/state";
import { useNftCollectionActivitiesSequencer } from "lib/services/nft-collection";
import type { HexAddr32 } from "lib/types";

import { ActivitiesTable } from "./ActivitiesTable";

interface ActivitiesSequencerProps {
  collectionAddress: HexAddr32;
}

export const ActivitiesSequencer = ({
  collectionAddress,
}: ActivitiesSequencerProps) => {
  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useNftCollectionActivitiesSequencer(collectionAddress);

  return (
    <Stack spacing="32px" mt="32px">
      <Heading as="h6" variant="h6" fontWeight={600}>
        Activities in this collection
      </Heading>
      <ActivitiesTable
        collectionAddress={collectionAddress}
        activities={data}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            message="There are no activities matches your keyword."
            imageVariant="not-found"
            withBorder
          />
        }
      />
      {hasNextPage && (
        <LoadNext
          text="Load more activities"
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      )}
    </Stack>
  );
};
