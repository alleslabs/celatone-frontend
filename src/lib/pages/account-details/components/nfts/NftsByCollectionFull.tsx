import { Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { useMobile } from "lib/app-provider";
import InputWithIcon from "lib/components/InputWithIcon";
import { NftList } from "lib/components/nft";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { useDebounce } from "lib/hooks";
import { useNftsByAccountByCollection } from "lib/services/nft";
import type { HexAddr, HexAddr32 } from "lib/types";

interface NftsByCollectionFullProps {
  accountAddress: HexAddr;
  collectionAddress?: HexAddr32;
}

export const NftsByCollectionFull = ({
  accountAddress,
  collectionAddress,
}: NftsByCollectionFullProps) => {
  const isMobile = useMobile();
  const [searchKeyword, setSearchKeyword] = useState("");
  const debouncedSearch = useDebounce(searchKeyword);

  const {
    pagesQuantity,
    setTotalData,
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
  const { data, isLoading } = useNftsByAccountByCollection(
    accountAddress,
    pageSize,
    offset,
    debouncedSearch,
    collectionAddress,
    {
      onSuccess: ({ total }) => setTotalData(total),
    }
  );

  useEffect(() => {
    setPageSize(10);
    setCurrentPage(1);
    setSearchKeyword("");
  }, [collectionAddress, setPageSize, setCurrentPage]);

  useEffect(() => setCurrentPage(1), [debouncedSearch, setCurrentPage]);

  return (
    <Stack spacing="24px" w="full">
      <InputWithIcon
        placeholder="Search with Token ID or NFT VM Address"
        value={searchKeyword}
        autoFocus={!isMobile}
        onChange={(e) => setSearchKeyword(e.target.value)}
        size={{ base: "md", md: "lg" }}
        amptrackSection="nft-account-detail-tokenid-search"
      />
      <NftList
        nfts={data?.nfts}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            message={
              searchKeyword
                ? "There are no NFTs matches your keyword."
                : "There are currently no NFTs held by this account."
            }
            imageVariant="empty"
            withBorder
          />
        }
        showCollection
      />
      {data && data.total > 10 && (
        <Pagination
          currentPage={currentPage}
          pagesQuantity={pagesQuantity}
          offset={offset}
          totalData={data.total}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(e) => {
            const size = Number(e.target.value);
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      )}
    </Stack>
  );
};
