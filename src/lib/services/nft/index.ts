import type { UseQueryOptions } from "@tanstack/react-query";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

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
import { getNftByNftAddressLcd } from "./lcd";
import {
  getNftMintInfoSequencer,
  getNftsByAccountSequencer,
  getNftsSequencer,
  getNftTransactionsSequencer,
} from "./sequencer";

export const useNfts = (
  collectionAddress: HexAddr32,
  limit: number,
  offset: number,
  search = "",
  enabled = true
) => {
  const { chainConfig } = useCelatoneApp();

  return useQuery<Nft[]>(
    [
      CELATONE_QUERY_KEYS.NFTS,
      chainConfig.graphql,
      collectionAddress,
      limit,
      offset,
      search,
    ],
    async () =>
      getNfts(
        chainConfig.graphql ?? "",
        collectionAddress,
        search,
        limit,
        offset
      ),
    {
      retry: 1,
      refetchOnWindowFocus: false,
      enabled,
    }
  );
};

export const useNftsSequencer = (
  collectionAddress: HexAddr32,
  limit: number,
  offset: number,
  search = "",
  enabled = true
) => {
  const lcdEndpoint = useLcdEndpoint();

  const { data, ...rest } = useQuery<Nft[]>(
    [CELATONE_QUERY_KEYS.NFTS_SEQUENCER, lcdEndpoint, collectionAddress],
    async () => getNftsSequencer(lcdEndpoint, collectionAddress),
    {
      retry: 1,
      refetchOnWindowFocus: false,
      enabled,
    }
  );

  const computedData = useMemo(() => {
    if (!data) return data;
    const filteredData = data.filter(
      (val) =>
        val.tokenId.toLowerCase().includes(search.toLowerCase()) ||
        val.nftAddress.toLowerCase() === search.toLowerCase()
    );
    return limit ? filteredData?.slice(offset, limit + offset) : filteredData;
  }, [data, limit, offset, search]);

  return {
    data: computedData,
    ...rest,
  };
};

export const useNftByNftAddress = (
  collectionAddress: HexAddr32,
  nftAddress: HexAddr32,
  enabled = true
) => {
  const { chainConfig } = useCelatoneApp();

  return useQuery(
    [
      CELATONE_QUERY_KEYS.NFT_BY_NFT_ADDRESS,
      chainConfig.graphql,
      collectionAddress,
      nftAddress,
    ],
    async () =>
      getNftByNftAddress(
        chainConfig.graphql ?? "",
        collectionAddress,
        nftAddress
      ),
    {
      enabled,
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export const useNftByNftAddressLcd = (
  nftAddress: HexAddr32,
  enabled = true
) => {
  const lcdEndpoint = useLcdEndpoint();

  return useQuery(
    [CELATONE_QUERY_KEYS.NFT_BY_NFT_ADDRESS_LCD, lcdEndpoint, nftAddress],
    async () => getNftByNftAddressLcd(lcdEndpoint, nftAddress),
    {
      enabled,
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
      chainConfig.graphql,
      lcdEndpoint,
      tier,
      nftAddress,
      prefix,
    ],
    async () =>
      handleQueryByTier({
        tier,
        threshold: "sequencer",
        queryFull: () => getNftMintInfo(chainConfig.graphql ?? "", nftAddress),
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
      chainConfig.graphql,
      nftAddress,
      limit,
      offset,
    ],
    async () =>
      getNftTransactions(chainConfig.graphql ?? "", nftAddress, limit, offset),
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

  const { data, ...rest } = useInfiniteQuery(
    [CELATONE_QUERY_KEYS.NFT_TRANSACTIONS_SEQUENCER, lcdEndpoint],
    async ({ pageParam }) =>
      getNftTransactionsSequencer(lcdEndpoint, pageParam, nftAddress),
    {
      getNextPageParam: (lastPage) => lastPage.pagination.nextKey ?? undefined,
      refetchOnWindowFocus: false,
      enabled,
      retry: 1,
    }
  );

  return {
    data: data?.pages.flatMap((page) => page.items),
    ...rest,
  };
};

export const useNftTransactionsCount = (
  nftAddress: HexAddr32,
  enabled = true
) => {
  const { chainConfig } = useCelatoneApp();
  return useQuery<number>(
    [
      CELATONE_QUERY_KEYS.NFT_TRANSACTIONS_COUNT,
      chainConfig.graphql,
      nftAddress,
    ],
    async () => getNftTransactionsCount(chainConfig.graphql ?? "", nftAddress),
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
      chainConfig.graphql,
      nftAddress,
      limit,
      offset,
    ],
    async () =>
      getNftMutateEvents(chainConfig.graphql ?? "", nftAddress, offset, limit),
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
      chainConfig.graphql,
      nftAddress,
      enabled,
    ],
    async () => getNftMutateEventsCount(chainConfig.graphql ?? "", nftAddress),
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
      chainConfig.graphql,
      accountAddress,
    ],
    async () =>
      getNftsCountByAccount(chainConfig.graphql ?? "", accountAddress),
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
      chainConfig.graphql,
      accountAddress,
      limit,
      offset,
      collectionAddress,
      search,
    ],
    async () =>
      getNftsByAccount(
        chainConfig.graphql ?? "",
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
