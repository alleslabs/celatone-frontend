import { Stack } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import InputWithIcon from "lib/components/InputWithIcon";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { useDebounce } from "lib/hooks";
import { useNftCollections } from "lib/services/nft-collection";
import router from "next/router";
import { useEffect, useState } from "react";

import { CollectionList } from "./CollectionList";

export const Collections = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const debouncedSearch = useDebounce(searchKeyword);

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
          amptrackSection="nft-collections-list-search"
          autoFocus
          placeholder="Search with collection name or collection VM address"
          size={{ base: "md", md: "lg" }}
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <CollectionList
          collections={collections?.items}
          isLoading={isLoading}
        />
      </Stack>
      {!isLoading && collections && collections.total > 0 && (
        <Pagination
          currentPage={currentPage}
          offset={offset}
          pageSize={pageSize}
          pagesQuantity={pagesQuantity}
          totalData={collections?.total}
          onPageChange={setCurrentPage}
          onPageSizeChange={(e) => {
            const size = Number(e.target.value);
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      )}
    </>
  );
};
