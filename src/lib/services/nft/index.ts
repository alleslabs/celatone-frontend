import type { UseQueryOptions } from "@tanstack/react-query";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCelatoneApp,
  useCurrentChain,
  useEvmConfig,
  useMoveConfig,
  useNftConfig,
  useTierConfig,
  useWasmConfig,
} from "lib/app-provider";
import {
  type BechAddr,
  type BechAddr32,
  type HexAddr,
  type HexAddr32,
  type Option,
  zHexAddr32,
} from "lib/types";
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
import {
  getNftByNftAddressMoveRest,
  getNftByTokenIdEvmRest,
  getNftByTokenIdWasmRest,
} from "./rest";
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

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery(
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
    data: data?.pages.flatMap<NftSequencer>((page) => page.tokens),
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
  };
};

export const useNftByTokenId = (
  collectionAddressHex: HexAddr,
  collectionAddressBech: BechAddr32,
  tokenId: string,
  enabled = true
) => {
  const { tier } = useTierConfig();
  const moveConfig = useMoveConfig({ shouldRedirect: false });
  const evmConfig = useEvmConfig({
    shouldRedirect: false,
  });
  const wasmConfig = useWasmConfig({
    shouldRedirect: false,
  });
  const apiEndpoint = useBaseApiRoute("nfts");
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  // Token ID can be a string, a address or a number
  const nftAddress = zHexAddr32.parse(tokenId);

  return useQuery(
    [
      CELATONE_QUERY_KEYS.NFT_BY_TOKEN_ID,
      collectionAddressHex,
      collectionAddressBech,
      tokenId,
      tier,
      apiEndpoint,
      restEndpoint,
      evmConfig,
      moveConfig,
      wasmConfig,
    ],
    () =>
      handleQueryByTier({
        queryFull: () =>
          getNftByNftAddress(
            apiEndpoint,
            collectionAddressHex as HexAddr32,
            nftAddress
          ),
        querySequencer: () => {
          if (moveConfig.enabled)
            return getNftByNftAddressMoveRest(restEndpoint, nftAddress);
          if (evmConfig.enabled)
            return getNftByTokenIdEvmRest(
              evmConfig.jsonRpc,
              collectionAddressHex,
              tokenId
            );
          if (wasmConfig.enabled)
            return getNftByTokenIdWasmRest(
              restEndpoint,
              collectionAddressBech,
              tokenId
            );
          throw new Error("Unsupported VM (useNftByTokenId)");
        },
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

export const useNftByNftAddressMoveRest = (
  nftAddress: HexAddr32,
  enabled = true
) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  return useQuery(
    [CELATONE_QUERY_KEYS.NFT_BY_NFT_ADDRESS_REST, nftAddress, restEndpoint],
    async () => getNftByNftAddressMoveRest(restEndpoint, nftAddress),
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
  nftAddress: Option<HexAddr32>,
  limit: number,
  offset: number,
  options: Pick<UseQueryOptions<NftTxsResponse>, "enabled" | "onSuccess"> = {}
) => {
  const apiEndpoint = useBaseApiRoute("nfts");

  return useQuery(
    [CELATONE_QUERY_KEYS.NFT_TRANSACTIONS, nftAddress, limit, offset],
    () => {
      if (!nftAddress)
        throw new Error("NFT address is required (useNftTransactions)");

      return getNftTxs(apiEndpoint, nftAddress, limit, offset);
    },
    {
      refetchOnWindowFocus: false,
      retry: 1,
      ...options,
    }
  );
};

// For Move only
export const useNftTransactionsSequencer = (
  nftAddress: HexAddr32,
  enabled = true
) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery(
      [CELATONE_QUERY_KEYS.NFT_TRANSACTIONS_SEQUENCER, restEndpoint],
      async ({ pageParam }) =>
        getNftTransactionsSequencer(restEndpoint, pageParam, nftAddress),
      {
        enabled,
        getNextPageParam: (lastPage) =>
          lastPage.pagination.nextKey ?? undefined,
        refetchOnWindowFocus: false,
        retry: 1,
      }
    );

  return {
    data: data?.pages.flatMap((page) => page.items),
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  };
};

export const useNftMutateEvents = (
  nftAddress: Option<HexAddr32>,
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
    () => {
      if (!nftAddress)
        throw new Error("NFT address is required (useNftMutateEvents)");

      return getNftMutateEvents(apiEndpoint, nftAddress, limit, offset);
    },
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
