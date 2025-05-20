import type { Collection } from "lib/services/types";
import type { Option } from "lib/types";

import { GridItem, SimpleGrid } from "@chakra-ui/react";
import { Loading } from "lib/components/Loading";
import { EmptyState, ErrorFetching } from "lib/components/state";

import { CollectionCard } from "./CollectionCard";

interface CollectionListProps {
  collections: Option<Collection[]>;
  isLoading: boolean;
}

export const CollectionList = ({
  collections,
  isLoading,
}: CollectionListProps) => {
  if (isLoading) return <Loading />;
  if (!collections) return <ErrorFetching dataName="collections" />;
  if (!collections.length)
    return (
      <EmptyState
        imageVariant="empty"
        message="There are currently no NFT collections on this network."
        withBorder
      />
    );

  return (
    <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={{ base: 4, xl: 8 }}>
      {collections.map((collection) => (
        <GridItem key={collection.collectionAddress}>
          <CollectionCard collectionInfo={collection} />
        </GridItem>
      ))}
    </SimpleGrid>
  );
};
