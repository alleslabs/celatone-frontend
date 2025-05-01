import type { UseQueryOptions } from "@tanstack/react-query";
import type {
  BechAddr,
  BechAddr32,
  HexAddr,
  HexAddr32,
  Option,
} from "lib/types";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCelatoneApp,
  useCurrentChain,
  useNftConfig,
  useTierConfig,
} from "lib/app-provider";
import { useCallback } from "react";

import type {
  Metadata,
  NftMintInfo,
  NftMutateEventsResponse,
  NftsByAccountAddressResponse,
  NftSequencer,
  NftsResponse,
  NftTxsResponse,
} from "../types";

import { handleQueryByTier } from "../utils";
import {
  getMetadata,
  getNftByNftAddress,
  getNftMintInfo,
  getNftMutateEvents,
  getNftsByAccountAddress,
  getNftsByCollectionAddress,
  getNftTxs,
} from "./api";
import { getNftByNftAddressRest } from "./rest";
import {
  getNftMintInfoSequencer,
  getNftsByAccountSequencer,
  getNftsSequencer,
  getNftsSequencerLoop,
  getNftTransactionsSequencer,
} from "./sequencer";

export const useNfts = (
  collectionAddressBech: BechAddr32,
  collectionAddressHex: HexAddr32,
  limit: number,
  offset: number,
  search = "",
  enabled = true
) => {
  const { tier } = useTierConfig();
  const apiEndpoint = useBaseApiRoute("nfts");
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  return useQuery<NftsResponse>(
    [
      CELATONE_QUERY_KEYS.NFTS,
      collectionAddressHex,
      collectionAddressBech,
      limit,
      offset,
      search,
      tier,
      apiEndpoint,
      restEndpoint,
    ],
    async () =>
      handleQueryByTier({
        queryFull: () =>
          getNftsByCollectionAddress(
            apiEndpoint,
            collectionAddressHex,
            search,
            limit,
            offset
          ),
        querySequencer: () =>
          getNftsSequencerLoop(restEndpoint, collectionAddressBech).then(
            (nfts) => {
              const filteredData = nfts.filter((val) => {
                if (!val.nftAddress) return true;
                return (
                  val.tokenId.toLowerCase().includes(search.toLowerCase()) ||
                  val.nftAddress?.toLowerCase() === search.toLowerCase()
                );
              });

              return {
                items: limit
                  ? filteredData?.slice(offset, limit + offset)
                  : filteredData,
              };
            }
          ),
        threshold: "sequencer",
        tier,
      }),
    {
      // NOTE: Disable the query when tier is not full for now
      // bring it back when we update our kvindexer
      enabled: tier === "full" ? enabled : false,
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
};

export const useNftsSequencer = (
  collectionAddressBech: BechAddr32,
  limit = 10,
  enabled = true
) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  const queryfn = useCallback(
    async (pageParam: Option<string>) =>
      getNftsSequencer(restEndpoint, collectionAddressBech, pageParam, limit),
    [restEndpoint, collectionAddressBech, limit]
  );

  const { data, ...rest } = useInfiniteQuery(
    [
      CELATONE_QUERY_KEYS.NFTS_SEQUENCER,
      restEndpoint,
      collectionAddressBech,
      limit,
    ],
    ({ pageParam }) => queryfn(pageParam),
    {
      enabled,
      getNextPageParam: (lastPage) => lastPage.pagination.nextKey ?? undefined,
      retry: 1,
    }
  );

  return {
    ...rest,
    data: data?.pages.flatMap<NftSequencer>((page) => page.tokens),
  };
};

export const useNftByNftAddress = (
  collectionAddress: HexAddr32,
  nftAddress: HexAddr32,
  enabled = true
) => {
  const { tier } = useTierConfig();
  const apiEndpoint = useBaseApiRoute("nfts");
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  return useQuery(
    [
      CELATONE_QUERY_KEYS.NFT_BY_NFT_ADDRESS,
      collectionAddress,
      nftAddress,
      tier,
      apiEndpoint,
      restEndpoint,
    ],
    async () =>
      handleQueryByTier({
        queryFull: () =>
          getNftByNftAddress(apiEndpoint, collectionAddress, nftAddress),
        querySequencer: () => getNftByNftAddressRest(restEndpoint, nftAddress),
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

export const useNftByNftAddressRest = (
  nftAddress: HexAddr32,
  enabled = true
) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  return useQuery(
    [CELATONE_QUERY_KEYS.NFT_BY_NFT_ADDRESS_REST, nftAddress, restEndpoint],
    async () => getNftByNftAddressRest(restEndpoint, nftAddress),
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
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  return useQuery<NftMintInfo>(
    [
      CELATONE_QUERY_KEYS.NFT_TOKEN_MINT_INFO,
      apiEndpoint,
      restEndpoint,
      tier,
      nftAddress,
      bech32Prefix,
    ],
    async () =>
      handleQueryByTier({
        queryFull: () => getNftMintInfo(apiEndpoint, nftAddress),
        querySequencer: () =>
          getNftMintInfoSequencer(restEndpoint, bech32Prefix, nftAddress),
        threshold: "sequencer",
        tier,
      }),
    {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
};

export const useMetadata = (uri: string) =>
  useQuery<Metadata>(
    [CELATONE_QUERY_KEYS.NFT_METADATA, uri],
    () => getMetadata(uri),
    {
      enabled: !!uri,
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );

export const useNftTransactions = (
  limit: number,
  offset: number,
  nftAddress: HexAddr32,
  options: Pick<UseQueryOptions<NftTxsResponse>, "enabled" | "onSuccess"> = {}
) => {
  const apiEndpoint = useBaseApiRoute("nfts");

  return useQuery(
    [CELATONE_QUERY_KEYS.NFT_TRANSACTIONS, nftAddress, limit, offset],
    () => getNftTxs(apiEndpoint, nftAddress, limit, offset),
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
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  const { data, ...rest } = useInfiniteQuery(
    [CELATONE_QUERY_KEYS.NFT_TRANSACTIONS_SEQUENCER, restEndpoint],
    async ({ pageParam }) =>
      getNftTransactionsSequencer(restEndpoint, pageParam, nftAddress),
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
  accountAddress: BechAddr,
  search = "",
  collectionAddress?: BechAddr32,
  enabled = true
) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  return useQuery<NftsByAccountAddressResponse>(
    [
      CELATONE_QUERY_KEYS.NFTS_BY_ACCOUNT_BY_COLLECTION_SEQUENCER,
      restEndpoint,
      accountAddress,
      collectionAddress,
      search,
    ],
    async () =>
      getNftsByAccountSequencer(
        restEndpoint,
        accountAddress,
        collectionAddress
      ),
    {
      enabled,
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
};
