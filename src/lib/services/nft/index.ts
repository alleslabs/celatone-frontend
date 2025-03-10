import type { UseQueryOptions } from "@tanstack/react-query";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCelatoneApp,
  useCurrentChain,
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
import type {
  Metadata,
  NftMintInfo,
  NftMutateEventsResponse,
  NftsByAccountAddressResponse,
  NftsResponse,
  NftTxsResponse,
} from "../types";
import { handleQueryByTier } from "../utils";

export const useNfts = (
  collectionAddress: HexAddr32,
  limit: number,
  offset: number,
  search = "",
  enabled = true
) => {
  const { tier } = useTierConfig();
  const apiEndpoint = useBaseApiRoute("nfts");
  const {
    chainConfig: { lcd: lcdEndpoint },
  } = useCelatoneApp();

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
        tier,
        threshold: "sequencer",
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
      }),
    {
      retry: 1,
      refetchOnWindowFocus: false,
      enabled,
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
  const {
    chainConfig: { lcd: lcdEndpoint },
  } = useCelatoneApp();

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
        tier,
        threshold: "sequencer",
        queryFull: () =>
          getNftByNftAddress(apiEndpoint, collectionAddress, nftAddress),
        querySequencer: () => getNftByNftAddressLcd(lcdEndpoint, nftAddress),
      }),
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
  const {
    chainConfig: { lcd: lcdEndpoint },
  } = useCelatoneApp();

  return useQuery(
    [CELATONE_QUERY_KEYS.NFT_BY_NFT_ADDRESS_LCD, nftAddress, lcdEndpoint],
    async () => getNftByNftAddressLcd(lcdEndpoint, nftAddress),
    {
      enabled,
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export const useNftMintInfo = (nftAddress: HexAddr32) => {
  const { bech32Prefix } = useCurrentChain();
  const { tier } = useTierConfig();
  const apiEndpoint = useBaseApiRoute("nfts");
  const {
    chainConfig: { lcd: lcdEndpoint },
  } = useCelatoneApp();

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
        tier,
        threshold: "sequencer",
        queryFull: () => getNftMintInfo(apiEndpoint, nftAddress),
        querySequencer: () =>
          getNftMintInfoSequencer(lcdEndpoint, bech32Prefix, nftAddress),
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
  nftAddress: HexAddr32,
  options: Pick<UseQueryOptions<NftTxsResponse>, "onSuccess" | "enabled"> = {}
) => {
  const apiEndpoint = useBaseApiRoute("nfts");

  return useQuery(
    [CELATONE_QUERY_KEYS.NFT_TRANSACTIONS, nftAddress, limit, offset],
    async () => getNftTxs(apiEndpoint, nftAddress, limit, offset),
    {
      retry: 1,
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};

export const useNftTransactionsSequencer = (
  nftAddress: HexAddr32,
  enabled = true
) => {
  const {
    chainConfig: { lcd: lcdEndpoint },
  } = useCelatoneApp();

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

export const useNftMutateEvents = (
  nftAddress: HexAddr32,
  limit: number,
  offset: number,
  options: Pick<
    UseQueryOptions<NftMutateEventsResponse>,
    "onSuccess" | "enabled"
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
      retry: 1,
      refetchOnWindowFocus: false,
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
    "onSuccess" | "enabled"
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
      retry: 1,
      refetchOnWindowFocus: false,
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
  const {
    chainConfig: { lcd: lcdEndpoint },
  } = useCelatoneApp();

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
      retry: 1,
      refetchOnWindowFocus: false,
      enabled,
    }
  );
};
