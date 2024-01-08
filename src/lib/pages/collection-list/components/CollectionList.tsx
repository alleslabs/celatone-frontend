import { GridItem, SimpleGrid } from "@chakra-ui/react";

import { AppLink } from "lib/components/AppLink";
import { Loading } from "lib/components/Loading";
import { EmptyState } from "lib/components/state";
import type { Collection } from "lib/services/nft/collection";

import CollectionCard from "./CollectionCard";

const CollectionList = ({
  collections,
  isLoading,
}: {
  collections?: Collection[];
  isLoading: boolean;
}) => {
  if (isLoading) return <Loading />;
  if (!collections || !collections.length)
    return (
      <EmptyState
        imageVariant="empty"
        message="There are currently no NFT collections on this network."
        withBorder
      />
    );

  return (
    <SimpleGrid columns={{ xl: 2, sm: 1 }} spacing={8}>
      {collections.map((collection) => (
        <GridItem key={collection.collectionAddress}>
          <AppLink href={`/nft-collections/${collection.collectionAddress}`}>
            <CollectionCard collectionInfo={collection} />
          </AppLink>
        </GridItem>
      ))}
    </SimpleGrid>
  );
};

export default CollectionList;
