import type { Collection } from "lib/services/types";
import type { Option } from "lib/types";

import { Flex, GridItem, SimpleGrid } from "@chakra-ui/react";
import { useCurrentChain, useTierConfig } from "lib/app-provider";
import { ConnectWalletBtn } from "lib/components/button/ConnectWallet";
import { ExplorerLink } from "lib/components/ExplorerLink";
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
  const { isFullTier } = useTierConfig();
  const { address } = useCurrentChain();

  if (isLoading) return <Loading />;
  if (!collections)
    return isFullTier ? (
      <ErrorFetching dataName="collections" />
    ) : (
      <EmptyState
        hasBorderTop
        imageVariant="error"
        message="This feature is not supported on this rollup at the moment. It will be available once it's upgraded to the latest version."
        my={12}
        py={8}
        withBorder={false}
      >
        <Flex alignItems="center" direction="row" gap={2}>
          {address ? (
            <>
              For now, go to
              <ExplorerLink
                showCopyOnHover
                type="user_address"
                value={address}
              />
              to see your NFTs
            </>
          ) : (
            <>
              For now, <ConnectWalletBtn /> to see your NFTs
            </>
          )}
        </Flex>
      </EmptyState>
    );
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
