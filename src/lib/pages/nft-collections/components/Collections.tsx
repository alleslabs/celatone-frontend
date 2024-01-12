import { Box, Stack } from "@chakra-ui/react";
import router from "next/router";
import { useEffect, useState } from "react";

import { AmpEvent, track } from "lib/amplitude";
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

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_NFT_COLLECTIONS_LIST);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  return (
    <Box>
      <Stack spacing={8}>
        <InputWithIcon
          placeholder="Search with Collection Name"
          value={searchKeyword}
          autoFocus
          onChange={(e) => setSearchKeyword(e.target.value)}
          size={{ base: "md", md: "lg" }}
          amptrackSection="nft-collections-list-search"
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
