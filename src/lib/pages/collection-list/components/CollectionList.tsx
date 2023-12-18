import { GridItem, SimpleGrid } from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { EmptyState } from "lib/components/state";
import type { NFTCollection } from "lib/types";

import CollectionCard from "./CollectionCard";

const CollectionList = ({
  collections,
  isLoading,
}: {
  collections?: NFTCollection[];
  isLoading: boolean;
}) => {
  const navigate = useInternalNavigate();

  if (isLoading) return <Loading />;
  if (!collections)
    return (
      <EmptyState
        imageVariant="empty"
        message="There is no collections"
        withBorder
      />
    );

  return (
    <SimpleGrid templateColumns="1fr 1fr" spacing="32px">
      {collections.map((collection) => {
        const { vmAddress } = collection.vmAddress;
        return (
          <GridItem
            key={vmAddress}
            onClick={() =>
              navigate({
                pathname: `/nfts/[collectionAddress]`,
                query: { collectionAddress: vmAddress },
              })
            }
            cursor="pointer"
          >
            <CollectionCard collectionInfo={collection} />
          </GridItem>
        );
      })}
    </SimpleGrid>
  );
};

export default CollectionList;
