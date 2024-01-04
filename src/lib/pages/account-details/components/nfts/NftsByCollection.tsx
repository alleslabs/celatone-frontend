import { Stack } from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";

import InputWithIcon from "lib/components/InputWithIcon";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import {
  useNftTokenListByAddressPagination,
  useUserNftListByCollectionPagination,
} from "lib/services/nftService";
import type { HexAddr } from "lib/types";

import { NftList } from "./NftList";

export const NftsByCollection = ({
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
    useUserNftListByCollectionPagination(
      userAddress,
      pageSize,
      offset,
      collectionAddress,
      searchKeyword
    );

  const { data: addNfts, isFetching: allNftsLoading } =
    useNftTokenListByAddressPagination(
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
      <InputWithIcon
        placeholder="Search with Token ID"
        value={searchKeyword}
        autoFocus
        onChange={(e) => setSearchKeyword(e.target.value)}
        size={{ base: "md", md: "lg" }}
      />
      <NftList
        nfts={collectionAddress ? nftsByCollection : addNfts}
        isLoading={nftsByCollectionLoading || allNftsLoading}
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
