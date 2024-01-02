import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { CELATONE_QUERY_KEYS, useCelatoneApp } from "lib/app-provider";
import {
  getNFTMutateEventsCount,
  getNFTMutateEventsPagination,
  getNFTTMintInfo,
  getNFTToken,
  getNFTTokenCountByAddress,
  getNFTTokenListByAddressPagination,
  getNFTTokenListPagination,
  getNFTTransactionPagination,
  getNFTTransactionsCount,
  getUserNFTListByCollectionPagination,
} from "lib/query";
import type { HexAddr } from "lib/types";
import { snakeToCamel } from "lib/utils";

import type {
  Metadata,
  NFTMintInfo,
  NFTMintInfoResponse,
  NFTMutateEventsPagination,
  NFTMutateEventsPaginationResponse,
  NFTToken,
  NFTTokenCountByAddressResponse,
  NFTTokenResponse,
  NFTTransactionPagination,
  NFTTransactionPaginationResponse,
} from "./nft";
import {
  zNFTMintInfoResponse,
  zNFTMutateEventsPaginationResponse,
  zNFTTokenResponse,
  zNFTTransactionPaginationResponse,
} from "./nft";

export const useNFTTokenListPagination = (
  collectionAddress: HexAddr,
  pageSize: number,
  offset: number,
  search?: string
) => {
  const { chainConfig } = useCelatoneApp();

  const queryFn = async () => {
    return axios
      .post<NFTTokenResponse>(chainConfig.indexer, {
        query: getNFTTokenListPagination,
        variables: {
          collectionAddress,
          limit: pageSize,
          offset,
          search: `%${search ?? ""}%`,
        },
      })
      .then(({ data: res }) =>
        res.data.nfts.map((nft) => zNFTTokenResponse.parse(nft))
      );
  };

  return useQuery<NFTToken[]>({
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

export const useNFTInfo = (collectionAddress: HexAddr, nftAddress: HexAddr) => {
  const { chainConfig } = useCelatoneApp();

  const queryFn = async () => {
    return axios
      .post(chainConfig.indexer, {
        query: getNFTToken,
        variables: { collectionAddress, nftAddress },
      })
      .then(({ data }) => zNFTTokenResponse.parse(data.data.nfts[0]));
  };

  return useQuery<NFTToken>({
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

export const useNFTMintInfo = (nftAddress: string) => {
  const { chainConfig } = useCelatoneApp();

  const queryFn = async () => {
    return axios
      .post<NFTMintInfoResponse>(chainConfig.indexer, {
        query: getNFTTMintInfo,
        variables: { nftAddress },
      })
      .then(({ data: res }) =>
        zNFTMintInfoResponse.parse(res.data.nft_transactions[0].transaction)
      );
  };

  return useQuery<NFTMintInfo>({
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

export const useNFTTransactionsCount = (nftAddress: string) => {
  const { chainConfig } = useCelatoneApp();

  const queryFn = async () => {
    return axios
      .post(chainConfig.indexer, {
        query: getNFTTransactionsCount,
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

export const useNFTTransactionsPagination = (
  limit: number,
  offset: number,
  nftAddress: string
) => {
  const { chainConfig } = useCelatoneApp();

  const queryFn = async () => {
    return axios
      .post<NFTTransactionPaginationResponse>(chainConfig.indexer, {
        query: getNFTTransactionPagination,
        variables: { limit, offset, nftAddress },
      })
      .then(({ data: res }) =>
        res.data.nft_transactions.map((tx) =>
          zNFTTransactionPaginationResponse.parse(tx)
        )
      );
  };

  return useQuery<NFTTransactionPagination[]>({
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

export const useNFTMutateEventsPagination = (
  limit: number,
  offset: number,
  nftAddress: string
) => {
  const { chainConfig } = useCelatoneApp();

  const queryFn = async () => {
    return axios
      .post<NFTMutateEventsPaginationResponse>(chainConfig.indexer, {
        query: getNFTMutateEventsPagination,
        variables: { limit, offset, nftAddress },
      })
      .then(({ data: res }) =>
        res.data.nft_mutation_events.map((event) =>
          zNFTMutateEventsPaginationResponse.parse(event)
        )
      );
  };

  return useQuery<NFTMutateEventsPagination[]>({
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

export const useNFTMutateEventsCount = (nftAddress: string) => {
  const { chainConfig } = useCelatoneApp();

  const queryFn = async () => {
    return axios
      .post(chainConfig.indexer, {
        query: getNFTMutateEventsCount,
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

export const useNFTTokenListByAddressPagination = (
  userAddress: string,
  pageSize: number,
  offset: number,
  search?: string
) => {
  const { chainConfig } = useCelatoneApp();

  const queryFn = async () => {
    return axios
      .post<NFTTokenResponse>(chainConfig.indexer, {
        query: getNFTTokenListByAddressPagination,
        variables: { userAddress, pageSize, offset, search: search ?? "" },
      })
      .then(({ data: res }) =>
        res.data.nfts.map((nft) => zNFTTokenResponse.parse(nft))
      );
  };

  return useQuery<NFTToken[]>({
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

export const useNFTTokenCountByAddress = (userAddress: string) => {
  const { chainConfig } = useCelatoneApp();

  const queryFn = async () => {
    return axios
      .post<NFTTokenCountByAddressResponse>(chainConfig.indexer, {
        query: getNFTTokenCountByAddress,
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

export const useUserNFTListByCollectionPagination = (
  userAddress: HexAddr,
  pageSize: number,
  offset: number,
  collectionAddress?: HexAddr,
  search?: string
) => {
  const { chainConfig } = useCelatoneApp();

  const queryFn = async () => {
    return axios
      .post<NFTTokenResponse>(chainConfig.indexer, {
        query: getUserNFTListByCollectionPagination,
        variables: { userAddress, collectionAddress, pageSize, offset, search },
      })
      .then(({ data: res }) =>
        res.data.nfts.map((nft) => zNFTTokenResponse.parse(nft))
      );
  };

  return useQuery<NFTToken[]>({
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
