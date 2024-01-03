import { SimpleGrid } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { NftCard } from "lib/components/NftCard";
import { EmptyState } from "lib/components/state";
import type { NftToken } from "lib/services/nft";

const NftList = ({
  nfts,
  isLoading,
}: {
  nfts?: NftToken[];
  isLoading?: boolean;
}) => {
  const isMobile = useMobile();
  const size = isMobile ? "150px" : "206px";
  if (isLoading) return <Loading />;
  if (!nfts || !nfts.length)
    return (
      <EmptyState
        message="There are no nfts matches your keyword."
        imageVariant="not-found"
      />
    );

  return (
    <SimpleGrid
      templateColumns={`repeat(auto-fill, ${size})`}
      spacing="24px"
      mt={8}
    >
      {nfts.map((nft) => (
        <NftCard key={nft.tokenId + nft.uri} {...nft} />
      ))}
    </SimpleGrid>
  );
};

export default NftList;
