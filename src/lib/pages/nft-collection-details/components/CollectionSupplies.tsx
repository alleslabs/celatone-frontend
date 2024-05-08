import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";

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
  const [searchKeyword, setSearchKeyword] = useState("");
  const debouncedSearch = useDebounce(searchKeyword);

  const {
    pagesQuantity,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    offset,
  } = usePaginator({
    initialState: {
      pageSize: 10,
      currentPage: 1,
      isDisabled: false,
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
    <Box mt="32px" gap="40px">
      <InputWithIcon
        placeholder="Search with Token ID or NFT VM Address"
        value={searchKeyword}
        autoFocus
        onChange={(e) => setSearchKeyword(e.target.value)}
        size={{ base: "md", md: "lg" }}
        amptrackSection="collection-supplies-tokenId-search"
      />
      <NftList
        nfts={nfts}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            imageVariant="not-found"
            message="There are no NFTs matches your keyword."
            withBorder
          />
        }
        showCollection={false}
      />
      {!isLoading && nfts && (
        <Pagination
          currentPage={currentPage}
          pagesQuantity={pagesQuantity}
          offset={offset}
          totalData={searchKeyword ? nfts.length : totalSupply}
          pageSize={pageSize}
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
