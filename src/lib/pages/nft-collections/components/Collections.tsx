import { Stack } from "@chakra-ui/react";
import router from "next/router";
import { useEffect, useState } from "react";

import { AmpEvent, track } from "lib/amplitude";
import InputWithIcon from "lib/components/InputWithIcon";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { useDebounce } from "lib/hooks";
import { useNftCollections } from "lib/services/nft-collection";

import { CollectionList } from "./CollectionList";

export const Collections = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const debouncedSearch = useDebounce(searchKeyword);

  const {
    currentPage,
    offset,
    pageSize,
    pagesQuantity,
    setCurrentPage,
    setPageSize,
    setTotalData,
  } = usePaginator({
    initialState: {
      currentPage: 1,
      isDisabled: false,
      pageSize: 10,
    },
  });
  const { data: collections, isLoading } = useNftCollections(
    pageSize,
    offset,
    debouncedSearch,
    {
      onSuccess: (data) => setTotalData(data.total),
    }
  );

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_NFT_COLLECTIONS_LIST);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  useEffect(() => setCurrentPage(1), [debouncedSearch, setCurrentPage]);

  return (
    <>
      <Stack spacing={8}>
        <InputWithIcon
          size={{ base: "md", md: "lg" }}
          value={searchKeyword}
          amptrackSection="nft-collections-list-search"
          autoFocus
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="Search with Collection Name or Collection VM Address"
        />
        <CollectionList
          collections={collections?.items}
          isLoading={isLoading}
        />
      </Stack>
      {!isLoading && collections && collections.total > 0 && (
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
          totalData={collections?.total}
        />
      )}
    </>
  );
};
