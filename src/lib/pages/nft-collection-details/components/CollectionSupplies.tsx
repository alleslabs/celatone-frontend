import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { useMobile } from "lib/app-provider";
import InputWithIcon from "lib/components/InputWithIcon";
import { NftList } from "lib/components/nft";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { useDebounce } from "lib/hooks";
import { useNfts } from "lib/services/nft";
import type { HexAddr32 } from "lib/types";

interface CollectionSuppliesProps {
  collectionAddress: HexAddr32;
  totalSupply: number;
}

export const CollectionSupplies = ({
  collectionAddress,
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
    collectionAddress,
    pageSize,
    offset,
    debouncedSearch
  );

  useEffect(() => setCurrentPage(1), [debouncedSearch, setCurrentPage]);

  return (
    <Box gap="40px" mt="32px">
      <InputWithIcon
        size={{ base: "md", md: "lg" }}
        value={searchKeyword}
        amptrackSection="collection-supplies-tokenId-search"
        autoFocus={!isMobile}
        onChange={(e) => setSearchKeyword(e.target.value)}
        placeholder="Search with Token ID or NFT VM Address"
      />
      <NftList
        emptyState={
          <EmptyState
            imageVariant="not-found"
            message="There are no NFTs matches your keyword."
            withBorder
          />
        }
        nfts={nfts?.items}
        isLoading={isLoading}
        showCollection={false}
      />
      {nfts && nfts.items.length !== 0 && (
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          pagesQuantity={pagesQuantity}
          offset={offset}
          onPageChange={setCurrentPage}
          onPageSizeChange={(e) => {
            const size = Number(e.target.value);
            setPageSize(size);
            setCurrentPage(1);
          }}
          totalData={searchKeyword ? nfts.items.length : totalSupply}
        />
      )}
    </Box>
  );
};
