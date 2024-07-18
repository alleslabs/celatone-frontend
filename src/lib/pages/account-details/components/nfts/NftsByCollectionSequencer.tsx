import { Stack } from "@chakra-ui/react";
import { useState } from "react";

import InputWithIcon from "lib/components/InputWithIcon";
import { NftList } from "lib/components/nft";
import { EmptyState } from "lib/components/state";
import { useDebounce } from "lib/hooks";
import type { Nft } from "lib/services/types";

interface NftsByCollectionSequencerProps {
  nfts: Nft[];
}

export const NftsByCollectionSequencer = ({
  nfts,
}: NftsByCollectionSequencerProps) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const debouncedSearch = useDebounce(searchKeyword);

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
        nfts={nfts.filter((nft) =>
          nft.tokenId.toLowerCase().includes(debouncedSearch.toLowerCase())
        )}
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
