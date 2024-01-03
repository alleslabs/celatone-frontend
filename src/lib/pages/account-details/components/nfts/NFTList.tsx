import { SimpleGrid } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { useMobile } from "lib/app-provider";
import { Loading } from "lib/components/Loading";
import { NftCard } from "lib/components/NftCard";
import type { NftToken } from "lib/services/nft";

export const NftList = ({
  nfts,
  isLoading,
  emptyState,
}: {
  nfts?: NftToken[];
  isLoading?: boolean;
  emptyState?: ReactNode;
}) => {
  const isMobile = useMobile();
  const size = isMobile ? "150px" : "206px";

  if (isLoading) return <Loading />;
  if (!nfts || !nfts.length) return emptyState;

  return (
    <SimpleGrid templateColumns={`repeat(auto-fill, ${size})`} spacing="24px">
      {nfts.map((nft) => (
        <NftCard key={nft.tokenId + nft.uri} {...nft} />
      ))}
    </SimpleGrid>
  );
};
