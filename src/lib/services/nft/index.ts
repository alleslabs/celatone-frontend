import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import type {
  Metadata,
  Nft,
  NftMintInfo,
  NftsByAccountResponse,
  NftTransactions,
} from "../types";
import { handleQueryByTier } from "../utils";
import {
  CELATONE_QUERY_KEYS,
  useCelatoneApp,
  useCurrentChain,
  useLcdEndpoint,
  useNftConfig,
  useTierConfig,
} from "lib/app-provider";
import type { HexAddr, HexAddr32, MutateEvent } from "lib/types";

import {
  getMetadata,
  getNftByNftAddress,
  getNftMintInfo,
  getNftMutateEvents,
  getNftMutateEventsCount,
  getNfts,
  getNftsByAccount,
  getNftsCountByAccount,
  getNftTransactions,
  getNftTransactionsCount,
} from "./gql";
import {
  getNftByNftAddressSequencer,
  getNftMintInfoSequencer,
  getNftsByAccountSequencer,
  getNftTransactionsSequencer,
} from "./sequencer";

export const useNfts = (
  collectionAddress: HexAddr32,
  limit: number,
  offset: number,
  search = ""
) => {
  const { chainConfig } = useCelatoneApp();

  return useQuery<Nft[]>(
    [
      CELATONE_QUERY_KEYS.NFTS,
      chainConfig.indexer,
      collectionAddress,
      limit,
      offset,
      search,
    ],
    async () =>
      getNfts(chainConfig.indexer, collectionAddress, search, limit, offset),
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
  const { tier } = useTierConfig();
  const lcdEndpoint = useLcdEndpoint();

  return useQuery(
    [
      CELATONE_QUERY_KEYS.NFT_BY_NFT_ADDRESS,
      chainConfig.indexer,
      collectionAddress,
      nftAddress,
      tier,
      lcdEndpoint,
    ],
    async () =>
      handleQueryByTier({
        tier,
        threshold: "sequencer",
        queryFull: () =>
          getNftByNftAddress(
            chainConfig.indexer,
            collectionAddress,
            nftAddress
          ),
        querySequencer: () =>
          getNftByNftAddressSequencer(lcdEndpoint, nftAddress),
      }),
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export const useNftMintInfo = (nftAddress: HexAddr32) => {
  const { chainConfig } = useCelatoneApp();
  const {
    chain: { bech32_prefix: prefix },
  } = useCurrentChain();
  const { tier } = useTierConfig();
  const lcdEndpoint = useLcdEndpoint();

  return useQuery<NftMintInfo>(
    [
      CELATONE_QUERY_KEYS.NFT_TOKEN_MINT_INFO,
      chainConfig.indexer,
      nftAddress,
      tier,
      prefix,
      lcdEndpoint,
    ],
    async () =>
      handleQueryByTier({
        tier,
        threshold: "sequencer",
        queryFull: () => getNftMintInfo(chainConfig.indexer, nftAddress),
        querySequencer: () =>
          getNftMintInfoSequencer(lcdEndpoint, prefix, nftAddress),
      }),
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
      getNftTransactions(chainConfig.indexer, nftAddress, limit, offset),
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export const useNftTransactionsSequencer = (
  nftAddress: HexAddr32,
  enabled = true
) => {
  const lcdEndpoint = useLcdEndpoint();

  return useQuery<NftTransactions[]>(
    [
      CELATONE_QUERY_KEYS.NFT_TRANSACTIONS_SEQUENCER,
      nftAddress,
      lcdEndpoint,
      enabled,
    ],
    async () => getNftTransactionsSequencer(lcdEndpoint, nftAddress),
    {
      retry: 1,
      refetchOnWindowFocus: false,
      enabled,
    }
  );
};

export const useNftTransactionsCount = (
  nftAddress: HexAddr32,
  enabled = true
) => {
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
      enabled,
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

export const useNftMutateEventsCount = (
  nftAddress: HexAddr32,
  enabled = true
) => {
  const { chainConfig } = useCelatoneApp();
  return useQuery<number>(
    [
      CELATONE_QUERY_KEYS.NFT_MUTATE_EVENTS_COUNT,
      chainConfig.indexer,
      nftAddress,
      enabled,
    ],
    async () => getNftMutateEventsCount(chainConfig.indexer, nftAddress),
    {
      retry: 1,
      refetchOnWindowFocus: false,
      enabled,
    }
  );
};

export const useNftsCountByAccount = (
  accountAddress: HexAddr,
  enabled = true
) => {
  const { chainConfig } = useCelatoneApp();
  const { enabled: nftConfigEnabled } = useNftConfig({ shouldRedirect: false });
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
      enabled: enabled && nftConfigEnabled,
    }
  );
};

export const useNftsByAccountByCollection = (
  accountAddress: HexAddr,
  limit: number,
  offset: number,
  search = "",
  collectionAddress?: HexAddr32,
  options: Pick<
    UseQueryOptions<NftsByAccountResponse>,
    "onSuccess" | "enabled"
  > = {}
) => {
  const { chainConfig } = useCelatoneApp();

  return useQuery<NftsByAccountResponse>(
    [
      CELATONE_QUERY_KEYS.NFTS_BY_ACCOUNT_BY_COLLECTION,
      chainConfig.indexer,
      accountAddress,
      limit,
      offset,
      collectionAddress,
      search,
    ],
    async () =>
      getNftsByAccount(
        chainConfig.indexer,
        accountAddress,
        limit,
        offset,
        collectionAddress,
        search
      ),
    {
      retry: 1,
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};

export const useNftsByAccountByCollectionSequencer = (
  accountAddress: HexAddr,
  search = "",
  collectionAddress?: HexAddr32,
  enabled = true
) => {
  const lcdEndpoint = useLcdEndpoint();

  return useQuery<NftsByAccountResponse>(
    [
      CELATONE_QUERY_KEYS.NFTS_BY_ACCOUNT_BY_COLLECTION_SEQUENCER,
      lcdEndpoint,
      accountAddress,
      collectionAddress,
      search,
    ],
    async () =>
      getNftsByAccountSequencer(lcdEndpoint, accountAddress, collectionAddress),
    {
      retry: 1,
      refetchOnWindowFocus: false,
      enabled,
    }
  );
};
