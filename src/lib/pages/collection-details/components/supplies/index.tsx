import { Box } from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useState } from "react";

import { TextInput } from "lib/components/forms";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { useNFTTokenListPagination } from "lib/services/nftService";
import type { HexAddr } from "lib/types";

import NFTList from "./NFTList";

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

  const { data: nfts, isLoading } = useNFTTokenListPagination(
    collectionAddress,
    pageSize,
    offset,
    searchKeyword
  );

  return (
    <Box mt="32px" gap="40px">
      <TextInput
        variant="fixed-floating"
        value={searchKeyword}
        setInputState={setSearchKeyword}
        placeholder="Search by name"
        size="md"
        mb="32px"
      />

      <NFTList nfts={nfts} isLoading={isLoading} />

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
