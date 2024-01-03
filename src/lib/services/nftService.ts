import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { CELATONE_QUERY_KEYS, useCelatoneApp } from "lib/app-provider";
import {
  getNftMutateEventsCount,
  getNftMutateEventsPagination,
  getNftMintInfo,
  getNftToken,
  getNftTokenCountByAddress,
  getNftTokenListByAddressPagination,
  getNftTokenListPagination,
  getNftTransactionPagination,
  getNftTransactionsCount,
  getUserNftListByCollectionPagination,
} from "lib/query";
import type { HexAddr } from "lib/types";
import { snakeToCamel } from "lib/utils";

import type {
  Metadata,
  NftMintInfo,
  NftMintInfoResponse,
  NftMutateEventsPagination,
  NftMutateEventsPaginationResponse,
  NftToken,
  NftTokenCountByAddressResponse,
  NftTokenResponse,
  NftTransactionPagination,
  NftTransactionPaginationResponse,
} from "./nft";
import {
  zNftMintInfoResponse,
  zNftMutateEventsPaginationResponse,
  zNftTokenResponse,
  zNftTransactionPaginationResponse,
} from "./nft";

export const useNftTokenListPagination = (
  collectionAddress: HexAddr,
  pageSize: number,
  offset: number,
  search?: string
) => {
  const { chainConfig } = useCelatoneApp();

  const queryFn = async () => {
    return axios
      .post<NftTokenResponse>(chainConfig.indexer, {
        query: getNftTokenListPagination,
        variables: {
          collectionAddress,
          limit: pageSize,
          offset,
          search: `%${search ?? ""}%`,
        },
      })
      .then(({ data: res }) => zNftTokenResponse.array().parse(res.data.nfts));
  };

  return useQuery<NftToken[]>({
    queryKey: [
      CELATONE_QUERY_KEYS.NFT_TOKEN_LIST_PAGINATION,
      chainConfig.indexer,
      collectionAddress,
      offset,
      pageSize,
      search,
    ],
    queryFn,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useNftInfo = (collectionAddress: HexAddr, nftAddress: HexAddr) => {
  const { chainConfig } = useCelatoneApp();

  const queryFn = async () => {
    return axios
      .post(chainConfig.indexer, {
        query: getNftToken,
        variables: { collectionAddress, nftAddress },
      })
      .then(({ data }) => zNftTokenResponse.parse(data.data.nfts[0]));
  };

  return useQuery<NftToken>({
    queryKey: [
      CELATONE_QUERY_KEYS.NFT_TOKEN_INFO,
      chainConfig.indexer,
      collectionAddress,
      nftAddress,
    ],
    queryFn,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useNftMintInfo = (nftAddress: string) => {
  const { chainConfig } = useCelatoneApp();

  const queryFn = async () => {
    return axios
      .post<NftMintInfoResponse>(chainConfig.indexer, {
        query: getNftMintInfo,
        variables: { nftAddress },
      })
      .then(({ data: res }) =>
        zNftMintInfoResponse.parse(res.data.nft_transactions[0].transaction)
      );
  };

  return useQuery<NftMintInfo>({
    queryKey: [
      CELATONE_QUERY_KEYS.NFT_TOKEN_MINT_INFO,
      chainConfig.indexer,
      nftAddress,
    ],
    queryFn,
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

export const useNftTransactionsCount = (nftAddress: string) => {
  const { chainConfig } = useCelatoneApp();

  const queryFn = async () => {
    return axios
      .post(chainConfig.indexer, {
        query: getNftTransactionsCount,
        variables: { nftAddress },
      })
      .then(
        ({ data: res }) => res.data.nft_transactions_aggregate.aggregate.count
      );
  };

  return useQuery<number>({
    queryKey: [
      CELATONE_QUERY_KEYS.NFT_TOKEN_TRANSACTION_COUNT,
      chainConfig.indexer,
      nftAddress,
    ],
    queryFn,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useNftTransactionsPagination = (
  limit: number,
  offset: number,
  nftAddress: string
) => {
  const { chainConfig } = useCelatoneApp();

  const queryFn = async () => {
    return axios
      .post<NftTransactionPaginationResponse>(chainConfig.indexer, {
        query: getNftTransactionPagination,
        variables: { limit, offset, nftAddress },
      })
      .then(({ data: res }) =>
        zNftTransactionPaginationResponse
          .array()
          .parse(res.data.nft_transactions)
      );
  };

  return useQuery<NftTransactionPagination[]>({
    queryKey: [
      CELATONE_QUERY_KEYS.NFT_TOKEN_TRANSACTION_PAGINATION,
      chainConfig.indexer,
      nftAddress,
      limit,
      offset,
    ],
    queryFn,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useNftMutateEventsPagination = (
  limit: number,
  offset: number,
  nftAddress: string
) => {
  const { chainConfig } = useCelatoneApp();

  const queryFn = async () => {
    return axios
      .post<NftMutateEventsPaginationResponse>(chainConfig.indexer, {
        query: getNftMutateEventsPagination,
        variables: { limit, offset, nftAddress },
      })
      .then(({ data: res }) =>
        zNftMutateEventsPaginationResponse
          .array()
          .parse(res.data.nft_mutation_events)
      );
  };

  return useQuery<NftMutateEventsPagination[]>({
    queryKey: [
      CELATONE_QUERY_KEYS.NFT_TOKEN_MUTATE_EVENTS_PAGINATION,
      chainConfig.indexer,
      nftAddress,
      limit,
      offset,
    ],
    queryFn,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useNftMutateEventsCount = (nftAddress: string) => {
  const { chainConfig } = useCelatoneApp();

  const queryFn = async () => {
    return axios
      .post(chainConfig.indexer, {
        query: getNftMutateEventsCount,
        variables: { nftAddress },
      })
      .then(
        ({ data }) => data.data.nft_mutation_events_aggregate.aggregate.count
      );
  };

  return useQuery<number>({
    queryKey: [
      CELATONE_QUERY_KEYS.NFT_TOKEN_MUTATE_EVENTS_COUNT,
      chainConfig.indexer,
      nftAddress,
    ],
    queryFn,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useNftTokenListByAddressPagination = (
  userAddress: string,
  pageSize: number,
  offset: number,
  search?: string
) => {
  const { chainConfig } = useCelatoneApp();

  const queryFn = async () => {
    return axios
      .post<NftTokenResponse>(chainConfig.indexer, {
        query: getNftTokenListByAddressPagination,
        variables: { userAddress, pageSize, offset, search: search ?? "" },
      })
      .then(({ data: res }) => zNftTokenResponse.array().parse(res.data.nfts));
  };

  return useQuery<NftToken[]>({
    queryKey: [
      CELATONE_QUERY_KEYS.NFT_TOKEN_LIST_BY_ADDRESS,
      chainConfig.indexer,
      userAddress,
      search,
    ],
    queryFn,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useNftTokenCountByAddress = (userAddress: string) => {
  const { chainConfig } = useCelatoneApp();

  const queryFn = async () => {
    return axios
      .post<NftTokenCountByAddressResponse>(chainConfig.indexer, {
        query: getNftTokenCountByAddress,
        variables: { userAddress },
      })
      .then(({ data: res }) => res.data.nfts_aggregate.aggregate.count);
  };

  return useQuery<number>({
    queryKey: [
      CELATONE_QUERY_KEYS.NFT_TOKEN_LIST_PAGINATION,
      chainConfig.indexer,
      userAddress,
    ],
    queryFn,
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

  const queryFn = async () => {
    return axios
      .post<NftTokenResponse>(chainConfig.indexer, {
        query: getUserNftListByCollectionPagination,
        variables: { userAddress, collectionAddress, pageSize, offset, search },
      })
      .then(({ data: res }) => zNftTokenResponse.array().parse(res.data.nfts));
  };

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
    queryFn,
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: !!collectionAddress,
  });
};
