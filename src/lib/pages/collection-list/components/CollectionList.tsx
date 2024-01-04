import { GridItem, SimpleGrid } from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { EmptyState } from "lib/components/state";
import type { Collection } from "lib/services/collection";

import CollectionCard from "./CollectionCard";

const CollectionList = ({
  collections,
  isLoading,
}: {
  collections?: Collection[];
  isLoading: boolean;
}) => {
  const navigate = useInternalNavigate();

  if (isLoading) return <Loading />;
  if (!collections || !collections.length)
    return (
      <EmptyState
        imageVariant="empty"
        message="There is no collections"
        withBorder
      />
    );

  return (
    <SimpleGrid columns={{ xl: 2, sm: 1 }} spacing="32px">
      {collections.map((collection) => (
        <GridItem
          key={collection.collectionAddress}
          onClick={() =>
            navigate({
              pathname: `/nft-collections/[collectionAddress]`,
              query: { collectionAddress: collection.collectionAddress },
            })
          }
          cursor="pointer"
        >
          <CollectionCard collectionInfo={collection} />
        </GridItem>
      ))}
    </SimpleGrid>
  );
};

export default CollectionList;
