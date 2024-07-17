import { Stack } from "@chakra-ui/react";
import { useState } from "react";

import InputWithIcon from "lib/components/InputWithIcon";
import { NftList } from "lib/components/nft";
import { EmptyState } from "lib/components/state";
import { useDebounce } from "lib/hooks";
import { useNftsByAccountByCollection } from "lib/services/nft";
import type { HexAddr, HexAddr32 } from "lib/types";

interface NftsByCollectionFullProps {
  accountAddress: HexAddr;
  collectionAddress?: HexAddr32;
}

export const NftsByCollectionSequencer = ({
  accountAddress,
  collectionAddress,
}: NftsByCollectionFullProps) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const debouncedSearch = useDebounce(searchKeyword);

  const { data, isLoading } = useNftsByAccountByCollection(
    accountAddress,
    10000,
    0,
    debouncedSearch,
    collectionAddress
  );

  return (
    <Stack spacing="24px" w="full">
      <InputWithIcon
        placeholder="Search with Token ID"
        value={searchKeyword}
        autoFocus
        onChange={(e) => setSearchKeyword(e.target.value)}
        size={{ base: "md", md: "lg" }}
        amptrackSection="nft-account-detail-tokenid-search"
      />
      <NftList
        nfts={data?.nfts.filter((nft) => nft.tokenId.includes(debouncedSearch))}
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
    </Stack>
  );
};
