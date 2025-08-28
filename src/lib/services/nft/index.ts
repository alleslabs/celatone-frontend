import type { UseQueryOptions } from "@tanstack/react-query";

import { useInfiniteQuery, useQueries, useQuery } from "@tanstack/react-query";
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
import { useNftAddressFormat } from "lib/hooks";
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
  Nft,
  NftMintInfo,
  NftMutateEventsResponse,
  NftsByAccountAddressResponse,
  NftsResponse,
  NftsResponseSequencer,
  NftTxsResponse,
} from "../types";

import { getIpfsUrl, handleQueryByTier } from "../utils";
import {
  getGlyphImage,
  getMetadata,
  getNftByNftAddress,
  getNftMintInfo,
  getNftMutateEvents,
  getNftsByAccountAddress,
  getNftsByCollectionAddress,
  getNftTxs,
} from "./api";
import { getNftRoyaltyInfoEvm } from "./json-rpc";
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
  collectionAddress: HexAddr32,
  limit: number,
  offset: number,
  search = "",
  enabled = true
) => {
  const { tier } = useTierConfig();
  const apiEndpoint = useBaseApiRoute("nfts");
  const {
    chainConfig: { indexer: indexerEndpoint },
  } = useCelatoneApp();
  const formatAddress = useNftAddressFormat();
  const formattedCollectionAddress = formatAddress(collectionAddress);

  return useQuery<NftsResponse>(
    [
      CELATONE_QUERY_KEYS.NFTS,
      collectionAddress,
      limit,
      offset,
      search,
      tier,
      apiEndpoint,
      indexerEndpoint,
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
          getNftsSequencerLoop(
            indexerEndpoint,
            formattedCollectionAddress
          ).then((nfts) => {
            const filteredData = nfts.filter((val) => {
              const lowerCaseSearch = search.toLowerCase();
              return (
                val.tokenId.toLowerCase().includes(lowerCaseSearch) ||
                val.nftAddress?.toLowerCase() === lowerCaseSearch
              );
            });

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
      // NOTE: use only in full tier for now.
      // There's no place where uses in sequencer
      enabled: tier === "full" ? enabled : false,
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
};

export const useNftsSequencer = (
  collectionAddress: HexAddr32,
  limit = 10,
  enabled = true
) => {
  const {
    chainConfig: { indexer: indexerEndpoint },
  } = useCelatoneApp();
  const { isSequencerTier } = useTierConfig();
  const formatNftAddress = useNftAddressFormat();
  const formattedCollectionAddress = formatNftAddress(collectionAddress);

  const queryfn = useCallback(
    async (pageParam: Option<string>) =>
      getNftsSequencer(
        indexerEndpoint,
        formattedCollectionAddress,
        pageParam,
        limit
      ),
    [indexerEndpoint, formattedCollectionAddress, limit]
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
      indexerEndpoint,
      formattedCollectionAddress,
      limit,
    ],
    ({ pageParam }) => queryfn(pageParam),
    {
      enabled: enabled && isSequencerTier,
      getNextPageParam: (lastPage) => lastPage.pagination.nextKey ?? undefined,
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );

  return {
    data: data?.pages.flatMap<Nft>((page) => page.tokens),
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

  // Nft address is available for Move VM only
  const nftAddress = moveConfig.enabled ? zHexAddr32.parse(tokenId) : undefined;

  return useQuery(
    [
      CELATONE_QUERY_KEYS.NFT_BY_TOKEN_ID,
      collectionAddressHex,
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
        queryFull: () => {
          if (!nftAddress)
            throw new Error("NFT address is required (useNftByTokenId)");

          return getNftByNftAddress(
            apiEndpoint,
            zHexAddr32.parse(collectionAddressHex),
            nftAddress
          );
        },
        querySequencer: () => {
          if (moveConfig.enabled && nftAddress)
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
    chainConfig: { indexer: indexerEndpoint },
  } = useCelatoneApp();
  const formatNftAddress = useNftAddressFormat();
  const formattedNftAddress = formatNftAddress(nftAddress);

  return useQuery<NftMintInfo>(
    [
      CELATONE_QUERY_KEYS.NFT_TOKEN_MINT_INFO,
      apiEndpoint,
      indexerEndpoint,
      tier,
      formattedNftAddress,
      bech32Prefix,
    ],
    async () =>
      handleQueryByTier({
        queryFull: () => getNftMintInfo(apiEndpoint, nftAddress),
        querySequencer: () =>
          getNftMintInfoSequencer(
            indexerEndpoint,
            bech32Prefix,
            formattedNftAddress
          ),
        threshold: "sequencer",
        tier,
      }),
    {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
};

export const useMetadata = (
  nft: Option<Partial<Nft>>,
  width?: string,
  height?: string
) => {
  const { currentChainId } = useCelatoneApp();

  return useQuery<Metadata>(
    [CELATONE_QUERY_KEYS.NFT_METADATA, nft],
    async () => {
      if (!nft) throw new Error("NFT is required (useMetadata)");
      const baseUri = await getMetadata(nft.uri ?? "");

      if (
        baseUri.image.startsWith("ipfs://") &&
        nft.collectionAddress &&
        (nft.nftAddress || nft.tokenId)
      ) {
        try {
          const image: Blob = await getGlyphImage(
            currentChainId,
            nft.collectionAddress,
            nft.nftAddress ?? nft.tokenId ?? "",
            width,
            height
          );

          baseUri.image = URL.createObjectURL(image);
        } catch {
          baseUri.image = getIpfsUrl(baseUri.image);
        }
      }

      return baseUri;
    },
    {
      enabled: !!nft,
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
};

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
    chainConfig: { indexer: indexerEndpoint },
  } = useCelatoneApp();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery(
      [CELATONE_QUERY_KEYS.NFT_TRANSACTIONS_SEQUENCER, indexerEndpoint],
      async ({ pageParam }) =>
        getNftTransactionsSequencer(indexerEndpoint, pageParam, nftAddress),
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

export const useNftsByAccountSequencer = (
  accountAddress: BechAddr,
  collectionAddress?: HexAddr32,
  tokenId?: string,
  limit?: number,
  enabled = true
) => {
  const {
    chainConfig: { indexer: indexerEndpoint },
  } = useCelatoneApp();
  const formatAddress = useNftAddressFormat();
  const formattedCollectionAddress = collectionAddress
    ? formatAddress(collectionAddress)
    : undefined;

  const queryfn = useCallback(
    async (pageParam: Option<string>) =>
      getNftsByAccountSequencer(
        indexerEndpoint,
        accountAddress,
        pageParam,
        formattedCollectionAddress,
        tokenId,
        limit
      ),
    [
      indexerEndpoint,
      accountAddress,
      limit,
      formattedCollectionAddress,
      tokenId,
    ]
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
      CELATONE_QUERY_KEYS.NFTS_BY_ACCOUNT_SEQUENCER,
      indexerEndpoint,
      accountAddress,
      ...(limit ? [limit] : []),
      ...(collectionAddress ? [collectionAddress] : []),
      ...(tokenId ? [tokenId] : []),
    ],
    ({ pageParam }) => queryfn(pageParam),
    {
      enabled,
      getNextPageParam: (lastPage) => lastPage.pagination.nextKey ?? undefined,
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );

  return {
    data: data?.pages.flatMap<Nft>((page) => page.tokens),
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
  };
};

export const useNftsByAccountCountSequencer = (
  accountAddress: BechAddr,
  collectionAddress?: HexAddr32,
  enabled = true
) => {
  const {
    chainConfig: { indexer: indexerEndpoint },
  } = useCelatoneApp();
  const formatAddress = useNftAddressFormat();
  const formattedCollectionAddress = collectionAddress
    ? formatAddress(collectionAddress)
    : undefined;

  return useQuery(
    [
      CELATONE_QUERY_KEYS.NFTS_COUNT_BY_ACCOUNT_SEQUENCER,
      indexerEndpoint,
      accountAddress,
      ...(collectionAddress ? [collectionAddress] : []),
    ],
    async () =>
      getNftsByAccountSequencer(
        indexerEndpoint,
        accountAddress,
        undefined,
        formattedCollectionAddress
      ),
    {
      enabled,
      refetchOnWindowFocus: false,
      retry: 1,
      select: (data) => data.pagination.total,
    }
  );
};

// To find nft count by collection address in account
export const useNftsByAccountCountSequencerBatch = (
  accountAddress: BechAddr,
  collectionAddresses: HexAddr32[],
  enabled = true
) => {
  const {
    chainConfig: { indexer: indexerEndpoint },
  } = useCelatoneApp();
  const formatAddress = useNftAddressFormat();

  return useQueries({
    queries: collectionAddresses.map((collectionAddress) => {
      const formattedCollectionAddress = formatAddress(collectionAddress);
      return {
        enabled,
        queryFn: async () =>
          getNftsByAccountSequencer(
            indexerEndpoint,
            accountAddress,
            undefined,
            formattedCollectionAddress
          ),
        queryKey: [
          CELATONE_QUERY_KEYS.NFTS_COUNT_BY_ACCOUNT_SEQUENCER,
          indexerEndpoint,
          accountAddress,
          collectionAddress,
        ],
        refetchOnWindowFocus: false,
        retry: 1,
        select: (data: NftsResponseSequencer) => data.pagination.total,
      };
    }),
  });
};

export const useNftRoyaltyInfoEvmSequencer = (collectionAddress: HexAddr32) => {
  const evmConfig = useEvmConfig({ shouldRedirect: false });
  const { data: nfts } = useNftsSequencer(collectionAddress, 1);

  return useQuery(
    [CELATONE_QUERY_KEYS.NFT_ROYALTY_INFO_EVM, collectionAddress, nfts],
    () => {
      if (!evmConfig.enabled)
        throw new Error("EVM is not enabled (useNftRoyaltyInfo)");

      if (!nfts || nfts.length === 0 || !nfts[0].tokenId) return 0;

      return getNftRoyaltyInfoEvm(
        evmConfig.jsonRpc,
        collectionAddress,
        nfts[0].tokenId
      );
    },
    { enabled: evmConfig.enabled, refetchOnWindowFocus: false, retry: 1 }
  );
};
