import { Box } from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useState } from "react";

import InputWithIcon from "lib/components/InputWithIcon";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { useNftTokenListPagination } from "lib/services/nft";
import type { HexAddr } from "lib/types";

import NftList from "./NftList";

const Supplies = ({
  collectionAddress,
  totalSupply,
}: {
  collectionAddress: HexAddr;
  totalSupply: number;
}) => {
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

  const onPageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const size = Number(e.target.value);
    setPageSize(size);
    setCurrentPage(1);
  };

  const [searchKeyword, setSearchKeyword] = useState("");

  const { data: nfts, isLoading } = useNftTokenListPagination(
    collectionAddress,
    pageSize,
    offset,
    searchKeyword
  );

  return (
    <Box mt="32px" gap="40px">
      <InputWithIcon
        placeholder="Search with Token ID"
        value={searchKeyword}
        autoFocus
        onChange={(e) => setSearchKeyword(e.target.value)}
        size={{ base: "md", md: "lg" }}
      />

      <NftList nfts={nfts} isLoading={isLoading} />

      {!isLoading && nfts && (
        <Pagination
          currentPage={currentPage}
          pagesQuantity={pagesQuantity}
          offset={offset}
          totalData={searchKeyword ? nfts.length : totalSupply}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </Box>
  );
};

export default Supplies;
