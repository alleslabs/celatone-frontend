import { Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import InputWithIcon from "lib/components/InputWithIcon";
import { NftList } from "lib/components/nft";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { useNftsByAccount, useAccountNftsByCollection } from "lib/services/nft";
import type { HexAddr, HexAddr32 } from "lib/types";

interface NftsByCollectionProps {
  accountAddress: HexAddr;
  totalData: number;
  collectionAddress?: HexAddr32;
}

export const NftsByCollection = ({
  accountAddress,
  totalData,
  collectionAddress,
}: NftsByCollectionProps) => {
  const [searchKeyword, setSearchKeyword] = useState("");

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

  const { data: allNfts, isFetching: isAllNftsLoading } = useNftsByAccount(
    accountAddress,
    pageSize,
    offset,
    searchKeyword
  );
  const { data: nftsByCollection, isFetching: isNftsByCollectionLoading } =
    useAccountNftsByCollection(
      accountAddress,
      pageSize,
      offset,
      searchKeyword,
      collectionAddress
    );

  useEffect(() => {
    setPageSize(10);
    setCurrentPage(1);
    setSearchKeyword("");
  }, [collectionAddress, setPageSize, setCurrentPage]);

  return (
    <Stack spacing="24px">
      <InputWithIcon
        placeholder="Search with Token ID"
        value={searchKeyword}
        autoFocus
        onChange={(e) => setSearchKeyword(e.target.value)}
        size={{ base: "md", md: "lg" }}
      />
      <NftList
        nfts={collectionAddress ? nftsByCollection : allNfts}
        isLoading={isNftsByCollectionLoading || isAllNftsLoading}
        emptyState={
          <EmptyState
            message={
              collectionAddress
                ? "There are no NFTs matches your keyword."
                : "There are currently no NFTs held by this account."
            }
            imageVariant="empty"
            withBorder
          />
        }
        showCollection
      />
      {totalData > 10 && (
        <Pagination
          currentPage={currentPage}
          pagesQuantity={pagesQuantity}
          offset={offset}
          totalData={totalData}
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
