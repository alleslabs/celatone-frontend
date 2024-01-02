import { Stack } from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";

import { TextInput } from "lib/components/forms";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import {
  useNFTTokenListByAddressPagination,
  useUserNFTListByCollectionPagination,
} from "lib/services/nftService";
import type { HexAddr } from "lib/types";

import { NFTList } from "./NFTList";

export const NFTsByCollection = ({
  collectionAddress,
  userAddress,
  totalCount,
}: {
  collectionAddress?: HexAddr;
  userAddress: HexAddr;
  totalCount: number;
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

  const [searchKeyword, setSearchKeyword] = useState("");

  const onPageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const size = Number(e.target.value);
    setPageSize(size);
    setCurrentPage(1);
  };

  const onPageChange = (nextPage: number) => {
    setCurrentPage(nextPage);
  };

  const { data: nftsByCollection, isFetching: nftsByCollectionLoading } =
    useUserNFTListByCollectionPagination(
      userAddress,
      pageSize,
      offset,
      collectionAddress,
      searchKeyword
    );

  const { data: addNFTs, isFetching: allNFTsLoading } =
    useNFTTokenListByAddressPagination(
      userAddress,
      pageSize,
      offset,
      searchKeyword
    );

  useEffect(() => {
    setPageSize(10);
    setCurrentPage(1);
    setSearchKeyword("");
  }, [collectionAddress, setPageSize, setCurrentPage]);

  return (
    <Stack spacing="24px">
      <TextInput
        variant="fixed-floating"
        value={searchKeyword}
        setInputState={setSearchKeyword}
        placeholder="Search by name"
        size="md"
      />
      <NFTList
        nfts={collectionAddress ? nftsByCollection : addNFTs}
        isLoading={nftsByCollectionLoading || allNFTsLoading}
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
      />
      {totalCount > 10 && (
        <Pagination
          currentPage={currentPage}
          pagesQuantity={pagesQuantity}
          offset={offset}
          totalData={totalCount}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </Stack>
  );
};
