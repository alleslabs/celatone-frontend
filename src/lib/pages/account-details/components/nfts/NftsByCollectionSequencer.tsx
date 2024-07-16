import { Stack } from "@chakra-ui/react";
import { useState } from "react";

import { useTierConfig } from "lib/app-provider";
import InputWithIcon from "lib/components/InputWithIcon";
import { LoadNext } from "lib/components/LoadNext";
import { NftList } from "lib/components/nft";
import { EmptyState } from "lib/components/state";
import { useDebounce } from "lib/hooks";
import { useNftsByAccountByCollectionSequencer } from "lib/services/nft";
import type { HexAddr, HexAddr32 } from "lib/types";

interface NftsByCollectionSequencerProps {
  accountAddress: HexAddr;
  collectionAddress?: HexAddr32;
}

export const NftsByCollectionSequencer = ({
  accountAddress,
  collectionAddress,
}: NftsByCollectionSequencerProps) => {
  const { isFullTier } = useTierConfig();
  const [searchKeyword, setSearchKeyword] = useState("");
  const debouncedSearch = useDebounce(searchKeyword);

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    useNftsByAccountByCollectionSequencer(
      accountAddress,
      10,
      debouncedSearch,
      collectionAddress,
      !isFullTier
    );

  return (
    <Stack spacing="24px" w="full">
      <InputWithIcon
        placeholder={`Search with Token ID${isFullTier ? " or NFT VM Address" : ""}`}
        value={searchKeyword}
        autoFocus
        onChange={(e) => setSearchKeyword(e.target.value)}
        size={{ base: "md", md: "lg" }}
        amptrackSection="nft-account-detail-tokenid-search"
      />
      <NftList
        nfts={data?.nfts}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            message={
              searchKeyword
                ? "There are no NFTs matches your keyword."
                : "There are currently no NFTs held by this account."
            }
            imageVariant="empty"
            withBorder
          />
        }
        showCollection
      />
      {hasNextPage && (
        <LoadNext
          text="Load more 10 NFTs"
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      )}
    </Stack>
  );
};
