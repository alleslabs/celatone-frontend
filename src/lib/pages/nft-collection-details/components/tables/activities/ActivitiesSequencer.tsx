import type { HexAddr32 } from "lib/types";

import { Heading, Stack } from "@chakra-ui/react";
import { LoadNext } from "lib/components/LoadNext";
import { EmptyState } from "lib/components/state";
import { useNftCollectionActivitiesSequencer } from "lib/services/nft-collection";

import { ActivitiesTable } from "./ActivitiesTable";

interface ActivitiesSequencerProps {
  collectionAddress: HexAddr32;
}

export const ActivitiesSequencer = ({
  collectionAddress,
}: ActivitiesSequencerProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useNftCollectionActivitiesSequencer(collectionAddress);

  return (
    <Stack mt="32px" spacing="32px">
      <Heading as="h6" fontWeight={600} variant="h6">
        Activities in this collection
      </Heading>
      <ActivitiesTable
        activities={data}
        collectionAddress={collectionAddress}
        emptyState={
          <EmptyState
            imageVariant="not-found"
            message="There are no activities matches your keyword."
            withBorder
          />
        }
        isLoading={isLoading}
      />
      {hasNextPage && (
        <LoadNext
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
          text="Load more activities"
        />
      )}
    </Stack>
  );
};
