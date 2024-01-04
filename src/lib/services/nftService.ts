import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { CELATONE_QUERY_KEYS, useCelatoneApp } from "lib/app-provider";
import type { HexAddr } from "lib/types";
import { snakeToCamel } from "lib/utils";

import type {
  Metadata,
  NftMintInfo,
  NftMutateEventsPagination,
  NftToken,
  NftTransactionPagination,
} from "./nft";
import {
  queryNftMintInfo,
  queryNftMutateEventsCount,
  queryNftMutateEventsPagination,
  queryNftToken,
  queryNftTokenCountByAddress,
  queryNftTokenListByAddressPagination,
  queryNftTokenListPagination,
  queryNftTransactionPagination,
  queryNftTransactionsCount,
  queryUserNftListByCollectionPagination,
} from "./nft";

export const useNftTokenListPagination = (
  collectionAddress: HexAddr,
  pageSize: number,
  offset: number,
  search?: string
) => {
  const { chainConfig } = useCelatoneApp();
  return useQuery<NftToken[]>({
    queryKey: [
      CELATONE_QUERY_KEYS.NFT_TOKEN_LIST_PAGINATION,
      chainConfig.indexer,
      collectionAddress,
      offset,
      pageSize,
      search,
    ],
    queryFn: () =>
      queryNftTokenListPagination(
        chainConfig.indexer,
        collectionAddress,
        pageSize,
        offset,
        search
      ),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useNftInfo = (collectionAddress: HexAddr, nftAddress: HexAddr) => {
  const { chainConfig } = useCelatoneApp();
  return useQuery<NftToken>({
    queryKey: [
      CELATONE_QUERY_KEYS.NFT_TOKEN_INFO,
      chainConfig.indexer,
      collectionAddress,
      nftAddress,
    ],
    queryFn: () =>
      queryNftToken(chainConfig.indexer, collectionAddress, nftAddress),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useNftMintInfo = (nftAddress: HexAddr) => {
  const { chainConfig } = useCelatoneApp();
  return useQuery<NftMintInfo>({
    queryKey: [
      CELATONE_QUERY_KEYS.NFT_TOKEN_MINT_INFO,
      chainConfig.indexer,
      nftAddress,
    ],
    queryFn: () => queryNftMintInfo(chainConfig.indexer, nftAddress),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useMetadata = (uri: string) => {
  const queryFn = async () => {
    const { data: metadata } = await axios.get(uri);
    return snakeToCamel(metadata);
  };

  return useQuery<Metadata>({
    queryKey: [CELATONE_QUERY_KEYS.NFT_METADATA, uri],
    queryFn,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useNftTransactionsCount = (nftAddress: HexAddr) => {
  const { chainConfig } = useCelatoneApp();
  return useQuery<number>({
    queryKey: [
      CELATONE_QUERY_KEYS.NFT_TOKEN_TRANSACTION_COUNT,
      chainConfig.indexer,
      nftAddress,
    ],
    queryFn: () => queryNftTransactionsCount(chainConfig.indexer, nftAddress),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useNftTransactionsPagination = (
  limit: number,
  offset: number,
  nftAddress: HexAddr
) => {
  const { chainConfig } = useCelatoneApp();
  return useQuery<NftTransactionPagination[]>({
    queryKey: [
      CELATONE_QUERY_KEYS.NFT_TOKEN_TRANSACTION_PAGINATION,
      chainConfig.indexer,
      nftAddress,
      limit,
      offset,
    ],
    queryFn: () =>
      queryNftTransactionPagination(
        chainConfig.indexer,
        nftAddress,
        offset,
        limit
      ),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useNftMutateEventsPagination = (
  limit: number,
  offset: number,
  nftAddress: HexAddr
) => {
  const { chainConfig } = useCelatoneApp();
  return useQuery<NftMutateEventsPagination[]>({
    queryKey: [
      CELATONE_QUERY_KEYS.NFT_TOKEN_MUTATE_EVENTS_PAGINATION,
      chainConfig.indexer,
      nftAddress,
      limit,
      offset,
    ],
    queryFn: () =>
      queryNftMutateEventsPagination(
        chainConfig.indexer,
        nftAddress,
        offset,
        limit
      ),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useNftMutateEventsCount = (nftAddress: HexAddr) => {
  const { chainConfig } = useCelatoneApp();
  return useQuery<number>({
    queryKey: [
      CELATONE_QUERY_KEYS.NFT_TOKEN_MUTATE_EVENTS_COUNT,
      chainConfig.indexer,
      nftAddress,
    ],
    queryFn: () => queryNftMutateEventsCount(chainConfig.indexer, nftAddress),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useNftTokenListByAddressPagination = (
  userAddress: HexAddr,
  pageSize: number,
  offset: number,
  search?: string
) => {
  const { chainConfig } = useCelatoneApp();
  return useQuery<NftToken[]>({
    queryKey: [
      CELATONE_QUERY_KEYS.NFT_TOKEN_LIST_BY_ADDRESS,
      chainConfig.indexer,
      userAddress,
      search,
      pageSize,
      offset,
    ],
    queryFn: () =>
      queryNftTokenListByAddressPagination(
        chainConfig.indexer,
        userAddress,
        pageSize,
        offset
      ),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useNftTokenCountByAddress = (userAddress: HexAddr) => {
  const { chainConfig } = useCelatoneApp();
  return useQuery<number>({
    queryKey: [
      CELATONE_QUERY_KEYS.NFT_TOKEN_LIST_PAGINATION,
      chainConfig.indexer,
      userAddress,
    ],
    queryFn: () =>
      queryNftTokenCountByAddress(chainConfig.indexer, userAddress),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useUserNftListByCollectionPagination = (
  userAddress: HexAddr,
  pageSize: number,
  offset: number,
  collectionAddress?: HexAddr,
  search?: string
) => {
  const { chainConfig } = useCelatoneApp();
  return useQuery<NftToken[]>({
    queryKey: [
      CELATONE_QUERY_KEYS.NFT_TOKEN_LIST_BY_COLLECTION_BY_ADDRESS_PAGINATION,
      chainConfig.indexer,
      userAddress,
      collectionAddress,
      pageSize,
      offset,
      search,
    ],
    queryFn: () =>
      queryUserNftListByCollectionPagination(
        chainConfig.indexer,
        userAddress,
        pageSize,
        offset,
        collectionAddress,
        search
      ),
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: !!collectionAddress,
  });
};
