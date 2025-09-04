import type { HexAddr32 } from "lib/types";

import { Box } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import InputWithIcon from "lib/components/InputWithIcon";
import { NftList } from "lib/components/nft";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { useDebounce } from "lib/hooks";
import { useNfts } from "lib/services/nft";
import { useEffect, useState } from "react";

interface CollectionSuppliesProps {
  collectionAddressHex: HexAddr32;
  totalSupply: number;
}

export const CollectionSuppliesFull = ({
  collectionAddressHex,
  totalSupply,
}: CollectionSuppliesProps) => {
  const isMobile = useMobile();
  const [searchKeyword, setSearchKeyword] = useState("");
  const debouncedSearch = useDebounce(searchKeyword);

  const {
    currentPage,
    offset,
    pageSize,
    pagesQuantity,
    setCurrentPage,
    setPageSize,
  } = usePaginator({
    initialState: {
      currentPage: 1,
      isDisabled: false,
      pageSize: 10,
    },
  });
  const { data: nfts, isLoading } = useNfts(
    collectionAddressHex,
    pageSize,
    offset,
    debouncedSearch
  );

  useEffect(() => setCurrentPage(1), [debouncedSearch, setCurrentPage]);

  return (
    <Box gap="40px" mt="32px">
      <InputWithIcon
        amptrackSection="collection-supplies-tokenId-search"
        autoFocus={!isMobile}
        placeholder="Search with token ID or NFT VM address"
        size={{ base: "md", md: "lg" }}
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
      />
      <NftList
        emptyState={
          <EmptyState
            imageVariant="not-found"
            message="There are no NFTs matches your keyword."
            withBorder
          />
        }
        isLoading={isLoading}
        nfts={nfts?.items}
        showCollection={false}
      />
      {nfts && nfts.items.length !== 0 && (
        <Pagination
          currentPage={currentPage}
          offset={offset}
          pageSize={pageSize}
          pagesQuantity={pagesQuantity}
          totalData={searchKeyword ? nfts.items.length : totalSupply}
          onPageChange={setCurrentPage}
          onPageSizeChange={(e) => {
            const size = Number(e.target.value);
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      )}
    </Box>
  );
};
