import { Box } from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useState } from "react";

import { TextInput } from "lib/components/forms";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { useCollectionsPagination } from "lib/services/nftService";

import CollectionList from "./CollectionList";

const Collections = () => {
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

  const [searchKeyword, setSearchKeyword] = useState("");

  const { data: collections, isLoading } = useCollectionsPagination(
    pageSize,
    offset,
    searchKeyword
  );

  const onPageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const size = Number(e.target.value);
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <Box overflow="auto">
      <TextInput
        variant="fixed-floating"
        value={searchKeyword}
        setInputState={setSearchKeyword}
        placeholder="Search by collection name"
        size="md"
        mb="32px"
      />

      <CollectionList collections={collections} isLoading={isLoading} />
      {!isLoading && collections && (
        <Pagination
          currentPage={currentPage}
          pagesQuantity={pagesQuantity}
          offset={offset}
          totalData={collections.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </Box>
  );
};

export default Collections;
