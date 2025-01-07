import { Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { useMobile } from "lib/app-provider";
import InputWithIcon from "lib/components/InputWithIcon";
import { NftList } from "lib/components/nft";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { useDebounce } from "lib/hooks";
import { useNftsByAccountAddress } from "lib/services/nft";
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
  const { data, isLoading } = useNftsByAccountAddress(
    accountAddress,
    pageSize,
    offset,
    collectionAddress,
    debouncedSearch,
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
        size={{ base: "md", md: "lg" }}
        value={searchKeyword}
        amptrackSection="nft-account-detail-tokenid-search"
        autoFocus={!isMobile}
        onChange={(e) => setSearchKeyword(e.target.value)}
        placeholder="Search with Token ID or NFT VM Address"
      />
      <NftList
        emptyState={
          <EmptyState
            imageVariant="empty"
            message={
              searchKeyword
                ? "There are no NFTs matches your keyword."
                : "There are currently no NFTs held by this account."
            }
            withBorder
          />
        }
        nfts={data?.items}
        isLoading={isLoading}
        showCollection
      />
      {data && data.total > 10 && (
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
          totalData={data.total}
        />
      )}
    </Stack>
  );
};
