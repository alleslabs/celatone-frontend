import { Box, Stack } from "@chakra-ui/react";
import { useState } from "react";

import InputWithIcon from "lib/components/InputWithIcon";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { useCollections } from "lib/services/nft";

import { CollectionList } from "./CollectionList";

export const Collections = () => {
  const [searchKeyword, setSearchKeyword] = useState("");

  const {
    pagesQuantity,
    currentPage,
    setCurrentPage,
    pageSize,
    setTotalData,
    setPageSize,
    offset,
  } = usePaginator({
    initialState: {
      pageSize: 10,
      currentPage: 1,
      isDisabled: false,
    },
  });
  const { data: collections, isLoading } = useCollections(
    pageSize,
    offset,
    searchKeyword,
    {
      onSuccess: (data) => setTotalData(data.total),
    }
  );

  return (
    <Box>
      <Stack spacing={8}>
        <InputWithIcon
          placeholder="Search with Collection Name"
          value={searchKeyword}
          autoFocus
          onChange={(e) => setSearchKeyword(e.target.value)}
          size={{ base: "md", md: "lg" }}
        />
        <CollectionList
          collections={collections?.items}
          isLoading={isLoading}
        />
      </Stack>
      {!isLoading && collections && (
        <Pagination
          currentPage={currentPage}
          pagesQuantity={pagesQuantity}
          offset={offset}
          totalData={collections?.total}
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
