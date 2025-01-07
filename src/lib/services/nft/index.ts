import type { UseQueryOptions } from "@tanstack/react-query";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import type {
  Metadata,
  NftMintInfo,
  NftMutateEventsResponse,
  NftsByAccountAddressResponse,
  NftsResponse,
  NftTxsResponse,
} from "../types";
import { handleQueryByTier } from "../utils";
import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCurrentChain,
  useLcdEndpoint,
  useNftConfig,
  useTierConfig,
} from "lib/app-provider";
import type { HexAddr, HexAddr32 } from "lib/types";

import {
  getMetadata,
  getNftByNftAddress,
  getNftMintInfo,
  getNftMutateEvents,
  getNftsByAccountAddress,
  getNftsByCollectionAddress,
  getNftTxs,
} from "./api";
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
  const { tier } = useTierConfig();
  const apiEndpoint = useBaseApiRoute("nfts");
  const lcdEndpoint = useLcdEndpoint();

  return useQuery<NftsResponse>(
    [
      CELATONE_QUERY_KEYS.NFTS,
      collectionAddress,
      limit,
      offset,
      search,
      tier,
      apiEndpoint,
      lcdEndpoint,
    ],
    async () =>
      handleQueryByTier({
        queryFull: () =>
          getNftsByCollectionAddress(
            apiEndpoint,
            collectionAddress,
            search,
            limit,
            offset
          ),
        querySequencer: () =>
          getNftsSequencer(lcdEndpoint, collectionAddress).then((nfts) => {
            const filteredData = nfts.filter(
              (val) =>
                val.tokenId.toLowerCase().includes(search.toLowerCase()) ||
                val.nftAddress.toLowerCase() === search.toLowerCase()
            );

            return {
              items: limit
                ? filteredData?.slice(offset, limit + offset)
                : filteredData,
            };
          }),
        threshold: "sequencer",
        tier,
      }),
    {
      enabled,
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
};

export const useNftByNftAddress = (
  collectionAddress: HexAddr32,
  nftAddress: HexAddr32,
  enabled = true
) => {
  const { tier } = useTierConfig();
  const apiEndpoint = useBaseApiRoute("nfts");
  const lcdEndpoint = useLcdEndpoint();

  return useQuery(
    [
      CELATONE_QUERY_KEYS.NFT_BY_NFT_ADDRESS,
      collectionAddress,
      nftAddress,
      tier,
      apiEndpoint,
      lcdEndpoint,
    ],
    async () =>
      handleQueryByTier({
        queryFull: () =>
          getNftByNftAddress(apiEndpoint, collectionAddress, nftAddress),
        querySequencer: () => getNftByNftAddressLcd(lcdEndpoint, nftAddress),
        threshold: "sequencer",
        tier,
      }),
    {
      enabled,
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
};

export const useNftByNftAddressLcd = (
  nftAddress: HexAddr32,
  enabled = true
) => {
  const lcdEndpoint = useLcdEndpoint();

  return useQuery(
    [CELATONE_QUERY_KEYS.NFT_BY_NFT_ADDRESS_LCD, nftAddress, lcdEndpoint],
    async () => getNftByNftAddressLcd(lcdEndpoint, nftAddress),
    {
      enabled,
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
};

export const useNftMintInfo = (nftAddress: HexAddr32) => {
  const { bech32Prefix } = useCurrentChain();
  const { tier } = useTierConfig();
  const apiEndpoint = useBaseApiRoute("nfts");
  const lcdEndpoint = useLcdEndpoint();

  return useQuery<NftMintInfo>(
    [
      CELATONE_QUERY_KEYS.NFT_TOKEN_MINT_INFO,
      apiEndpoint,
      lcdEndpoint,
      tier,
      nftAddress,
      bech32Prefix,
    ],
    async () =>
      handleQueryByTier({
        queryFull: () => getNftMintInfo(apiEndpoint, nftAddress),
        querySequencer: () =>
          getNftMintInfoSequencer(lcdEndpoint, bech32Prefix, nftAddress),
        threshold: "sequencer",
        tier,
      }),
    {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
};

export const useMetadata = (uri: string) => {
  return useQuery<Metadata>(
    [CELATONE_QUERY_KEYS.NFT_METADATA, uri],
    async () => getMetadata(uri),
    {
      enabled: !!uri,
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
};

export const useNftTransactions = (
  limit: number,
  offset: number,
  nftAddress: HexAddr32,
  options: Pick<UseQueryOptions<NftTxsResponse>, "enabled" | "onSuccess"> = {}
) => {
  const apiEndpoint = useBaseApiRoute("nfts");

  return useQuery(
    [CELATONE_QUERY_KEYS.NFT_TRANSACTIONS, nftAddress, limit, offset],
    async () => getNftTxs(apiEndpoint, nftAddress, limit, offset),
    {
      refetchOnWindowFocus: false,
      retry: 1,
      ...options,
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
      enabled,
      getNextPageParam: (lastPage) => lastPage.pagination.nextKey ?? undefined,
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );

  return {
    data: data?.pages.flatMap((page) => page.items),
    ...rest,
  };
};

export const useNftMutateEvents = (
  nftAddress: HexAddr32,
  limit: number,
  offset: number,
  options: Pick<
    UseQueryOptions<NftMutateEventsResponse>,
    "enabled" | "onSuccess"
  > = {}
) => {
  const apiEndpoint = useBaseApiRoute("nfts");

  return useQuery(
    [
      CELATONE_QUERY_KEYS.NFT_MUTATE_EVENTS,
      nftAddress,
      limit,
      offset,
      apiEndpoint,
    ],
    async () => getNftMutateEvents(apiEndpoint, nftAddress, limit, offset),
    {
      refetchOnWindowFocus: false,
      retry: 1,
      ...options,
    }
  );
};

export const useNftsByAccountAddress = (
  accountAddress: HexAddr,
  limit: number,
  offset: number,
  collectionAddress?: HexAddr32,
  search = "",
  options: Pick<
    UseQueryOptions<NftsByAccountAddressResponse>,
    "enabled" | "onSuccess"
  > = {}
) => {
  const apiEndpoint = useBaseApiRoute("nfts");
  const { enabled: nftConfigEnabled } = useNftConfig({ shouldRedirect: false });

  return useQuery(
    [
      CELATONE_QUERY_KEYS.NFTS_BY_ACCOUNT_BY_COLLECTION,
      accountAddress,
      apiEndpoint,
      nftConfigEnabled,
      limit,
      offset,
      collectionAddress ?? "",
      search,
    ],
    async () =>
      getNftsByAccountAddress(
        apiEndpoint,
        accountAddress,
        limit,
        offset,
        collectionAddress,
        search
      ),
    {
      refetchOnWindowFocus: false,
      retry: 1,
      ...options,
      enabled: options.enabled && nftConfigEnabled,
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

  return useQuery<NftsByAccountAddressResponse>(
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
      enabled,
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
};
