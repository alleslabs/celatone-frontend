import { useQuery } from "@tanstack/react-query";

import { CELATONE_QUERY_KEYS, useCelatoneApp } from "lib/app-provider";
import type { HexAddr, HexAddr32, MutateEvent } from "lib/types";

import type {
  NftTransactions,
  Metadata,
  NftMintInfo,
  Nft,
  NftByNftAddressResponse,
} from "./nft";
import {
  getNfts,
  getNftByNftAddress,
  getNftMintInfo,
  getMetadata,
  getNftTransactionsCount,
  getNftTransactions,
  getNftMutateEvents,
  getNftMutateEventsCount,
  getNftsByAccount,
  getNftsCountByAccount,
  getAccountNftsByCollection,
} from "./nft";

export const useNfts = (
  collectionAddress: HexAddr32,
  pageSize: number,
  offset: number,
  search = ""
) => {
  const { chainConfig } = useCelatoneApp();
  return useQuery<Nft[]>(
    [
      CELATONE_QUERY_KEYS.NFTS,
      chainConfig.indexer,
      collectionAddress,
      offset,
      pageSize,
      search,
    ],
    async () =>
      getNfts(chainConfig.indexer, collectionAddress, pageSize, offset, search),
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export const useNftByNftAddress = (
  collectionAddress: HexAddr32,
  nftAddress: HexAddr32
) => {
  const { chainConfig } = useCelatoneApp();
  return useQuery<NftByNftAddressResponse>(
    [
      CELATONE_QUERY_KEYS.NFT_BY_NFT_ADDRESS,
      chainConfig.indexer,
      collectionAddress,
      nftAddress,
    ],
    async () =>
      getNftByNftAddress(chainConfig.indexer, collectionAddress, nftAddress),
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export const useNftMintInfo = (nftAddress: HexAddr32) => {
  const { chainConfig } = useCelatoneApp();
  return useQuery<NftMintInfo>(
    [CELATONE_QUERY_KEYS.NFT_TOKEN_MINT_INFO, chainConfig.indexer, nftAddress],
    async () => getNftMintInfo(chainConfig.indexer, nftAddress),
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export const useMetadata = (uri: string) => {
  return useQuery<Metadata>(
    [CELATONE_QUERY_KEYS.NFT_METADATA, uri],
    async () => getMetadata(uri),
    {
      enabled: !!uri,
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export const useNftTransactions = (
  limit: number,
  offset: number,
  nftAddress: HexAddr32
) => {
  const { chainConfig } = useCelatoneApp();
  return useQuery<NftTransactions[]>(
    [
      CELATONE_QUERY_KEYS.NFT_TRANSACTIONS,
      chainConfig.indexer,
      nftAddress,
      limit,
      offset,
    ],
    async () =>
      getNftTransactions(chainConfig.indexer, nftAddress, offset, limit),
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export const useNftTransactionsCount = (nftAddress: HexAddr32) => {
  const { chainConfig } = useCelatoneApp();
  return useQuery<number>(
    [
      CELATONE_QUERY_KEYS.NFT_TRANSACTIONS_COUNT,
      chainConfig.indexer,
      nftAddress,
    ],
    async () => getNftTransactionsCount(chainConfig.indexer, nftAddress),
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export const useNftMutateEvents = (
  limit: number,
  offset: number,
  nftAddress: HexAddr32
) => {
  const { chainConfig } = useCelatoneApp();
  return useQuery<MutateEvent[]>(
    [
      CELATONE_QUERY_KEYS.NFT_MUTATE_EVENTS,
      chainConfig.indexer,
      nftAddress,
      limit,
      offset,
    ],
    async () =>
      getNftMutateEvents(chainConfig.indexer, nftAddress, offset, limit),
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export const useNftMutateEventsCount = (nftAddress: HexAddr32) => {
  const { chainConfig } = useCelatoneApp();
  return useQuery<number>(
    [
      CELATONE_QUERY_KEYS.NFT_MUTATE_EVENTS_COUNT,
      chainConfig.indexer,
      nftAddress,
    ],
    async () => getNftMutateEventsCount(chainConfig.indexer, nftAddress),
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export const useNftsByAccount = (
  accountAddress: HexAddr,
  pageSize: number,
  offset: number,
  search = ""
) => {
  const { chainConfig } = useCelatoneApp();
  return useQuery<Nft[]>(
    [
      CELATONE_QUERY_KEYS.NFTS_BY_ACCOUNT,
      chainConfig.indexer,
      accountAddress,
      pageSize,
      offset,
      search,
    ],
    async () =>
      getNftsByAccount(
        chainConfig.indexer,
        accountAddress,
        pageSize,
        offset,
        search
      ),
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export const useNftsCountByAccount = (accountAddress: HexAddr) => {
  const { chainConfig } = useCelatoneApp();
  return useQuery<number>(
    [
      CELATONE_QUERY_KEYS.NFTS_COUNT_BY_ACCOUNT,
      chainConfig.indexer,
      accountAddress,
    ],
    async () => getNftsCountByAccount(chainConfig.indexer, accountAddress),
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export const useAccountNftsByCollection = (
  accountAddress: HexAddr,
  pageSize: number,
  offset: number,
  search: string,
  collectionAddress?: HexAddr32
) => {
  const { chainConfig } = useCelatoneApp();
  return useQuery<Nft[]>(
    [
      CELATONE_QUERY_KEYS.NFTS_BY_ACCOUNT_BY_COLLECTION,
      chainConfig.indexer,
      accountAddress,
      pageSize,
      offset,
      search,
      collectionAddress,
    ],
    async () => {
      if (!collectionAddress)
        throw new Error("collection address is undefined");
      return getAccountNftsByCollection(
        chainConfig.indexer,
        accountAddress,
        pageSize,
        offset,
        search,
        collectionAddress
      );
    },
    {
      retry: 1,
      refetchOnWindowFocus: false,
      enabled: !!collectionAddress,
    }
  );
};
