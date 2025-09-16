import type { UseQueryOptions } from "@tanstack/react-query";
import type { Addr, BechAddr32, HexAddr32, Nullable } from "lib/types";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCelatoneApp,
  useCurrentChain,
  useMoveConfig,
  useTierConfig,
  useValidateAddress,
  useWasmConfig,
} from "lib/app-provider";
import { useNftAddressFormat } from "lib/hooks";

import type {
  ActivitiesResponse,
  CollectionByCollectionAddressResponse,
  CollectionCreatorResponse,
  CollectionMutateEventsResponse,
  NftCollectionsResponse,
} from "../types";

import { handleQueryByTier } from "../utils";
import {
  getNftCollectionActivitiesByCollectionAddress,
  getNftCollectionByCollectionAddress,
  getNftCollectionCreatorByCollectionAddress,
  getNftCollectionMutateEventsByCollectionAddress,
  getNftCollections,
  getNftCollectionsByAccountAddress,
} from "./api";
import { getCollectionByCollectionAddressWasmRest } from "./rest";
import {
  getNftCollecitonsByNameSequencer,
  getNftCollectionActivitiesSequencer,
  getNftCollectionByCollectionAddressSequencer,
  getNftCollectionCreatorByCollectionAddressSequencer,
  getNftCollectionsByAccountAddressSequencer,
  getNftCollectionsByCollectionAddressSequencer,
  getNftCollectionsSequencer,
} from "./sequencer";

export const useNftCollections = (
  limit: number,
  offset: number,
  search?: string,
  options?: Partial<UseQueryOptions<NftCollectionsResponse>>
) => {
  const apiEndpoint = useBaseApiRoute("nft_collections");

  return useQuery({
    queryKey: [
      CELATONE_QUERY_KEYS.NFT_COLLECTIONS,
      apiEndpoint,
      limit,
      offset,
      search,
    ],
    queryFn: () => getNftCollections(apiEndpoint, limit, offset, search),
    refetchOnWindowFocus: false,
    retry: 1,
    ...options,
  });
};

export const useNftCollectionsSequencer = (limit: number, search?: string) => {
  const {
    chainConfig: { indexer: indexerEndpoint },
  } = useCelatoneApp();
  const formatAddresses = useNftAddressFormat();
  const { isSomeValidAddress } = useValidateAddress();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: [
        CELATONE_QUERY_KEYS.NFT_COLLECTIONS_SEQUENCER,
        indexerEndpoint,
        limit,
        search ?? "",
      ],
      queryFn: ({ pageParam }: { pageParam?: string }) => {
        if (search) {
          if (isSomeValidAddress(search)) {
            const formattedAddress = formatAddresses(search);
            return getNftCollectionsByCollectionAddressSequencer(
              indexerEndpoint,
              formattedAddress
            );
          }

          return getNftCollecitonsByNameSequencer(
            indexerEndpoint,
            search,
            pageParam
          );
        }

        return getNftCollectionsSequencer(indexerEndpoint, limit, pageParam);
      },
      initialPageParam: undefined,
      getNextPageParam: (lastPage) => lastPage.pagination.nextKey ?? undefined,
      refetchOnWindowFocus: false,
    });

  return {
    data: data?.pages.flatMap((page) => page.collections),
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  };
};

export const useNftCollectionByCollectionAddress = (
  collectionAddress: HexAddr32,
  enabled = true
) => {
  const { tier } = useTierConfig();
  const { enabled: isMove } = useMoveConfig({ shouldRedirect: false });
  const apiEndpoint = useBaseApiRoute("nft_collections");
  const {
    chainConfig: { indexer: indexerEndpoint },
  } = useCelatoneApp();
  const formatAddress = useNftAddressFormat();

  return useQuery({
    queryKey: [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_BY_COLLECTION_ADDRESS,
      apiEndpoint,
      indexerEndpoint,
      tier,
      collectionAddress,
    ],
    queryFn: () => {
      const formattedCollectionAddress = formatAddress(collectionAddress);
      return handleQueryByTier<Nullable<CollectionByCollectionAddressResponse>>(
        {
          queryFull: () =>
            getNftCollectionByCollectionAddress(apiEndpoint, collectionAddress),
          querySequencer: () =>
            getNftCollectionByCollectionAddressSequencer(
              indexerEndpoint,
              formattedCollectionAddress,
              isMove
            ),
          threshold: "sequencer",
          tier,
        }
      );
    },

    enabled,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useNftCollectionInfosWasm = (collectionAddress: BechAddr32) => {
  const { enabled } = useWasmConfig({ shouldRedirect: false });
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  return useQuery({
    enabled,
    queryFn: () =>
      getCollectionByCollectionAddressWasmRest(restEndpoint, collectionAddress),
    queryKey: [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_INFOS_BY_COLLECTION_ADDRESS_WASM,
      collectionAddress,
      restEndpoint,
    ],
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useNftCollectionCreator = (
  collectionAddressBech: BechAddr32,
  collectionAddressHex: HexAddr32
) => {
  const { bech32Prefix } = useCurrentChain();
  const { tier } = useTierConfig();
  const apiEndpoint = useBaseApiRoute("nft_collections");
  const {
    chainConfig: { indexer: indexerEndpoint },
  } = useCelatoneApp();

  return useQuery<CollectionCreatorResponse>({
    queryKey: [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_CREATOR,
      apiEndpoint,
      indexerEndpoint,
      tier,
      bech32Prefix,
      collectionAddressHex,
      collectionAddressBech,
    ],
    queryFn: async () =>
      handleQueryByTier<CollectionCreatorResponse>({
        queryFull: () =>
          getNftCollectionCreatorByCollectionAddress(
            apiEndpoint,
            collectionAddressHex
          ),
        querySequencer: () =>
          getNftCollectionCreatorByCollectionAddressSequencer(
            indexerEndpoint,
            bech32Prefix,
            collectionAddressBech
          ),
        threshold: "sequencer",
        tier,
      }),
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useNftCollectionActivities = (
  collectionAddress: HexAddr32,
  limit: number,
  offset: number,
  search = "",
  options?: Partial<UseQueryOptions<ActivitiesResponse>>
) => {
  const apiEndpoint = useBaseApiRoute("nft_collections");

  return useQuery({
    queryKey: [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_ACTIVITIES,
      apiEndpoint,
      collectionAddress,
      limit,
      offset,
      search,
    ],
    queryFn: async () =>
      getNftCollectionActivitiesByCollectionAddress(
        apiEndpoint,
        collectionAddress,
        limit,
        offset,
        search
      ),
    refetchOnWindowFocus: false,
    retry: 1,
    ...options,
  });
};

export const useNftCollectionActivitiesSequencer = (
  collectionAddress: HexAddr32
) => {
  const {
    chainConfig: { indexer: indexerEndpoint },
  } = useCelatoneApp();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: [
        CELATONE_QUERY_KEYS.NFT_COLLECTION_ACTIVITIES_SEQUENCER,
        indexerEndpoint,
        collectionAddress,
      ],
      queryFn: ({ pageParam }: { pageParam?: string }) =>
        getNftCollectionActivitiesSequencer(
          indexerEndpoint,
          pageParam,
          collectionAddress
        ),
      initialPageParam: undefined,
      getNextPageParam: (lastPage) => lastPage.pagination.nextKey ?? undefined,
      refetchOnWindowFocus: false,
    });

  return {
    data: data?.pages.flatMap((page) => page.items),
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  };
};

export const useNftCollectionMutateEvents = (
  collectionAddress: HexAddr32,
  limit: number,
  offset: number,
  options?: Partial<UseQueryOptions<CollectionMutateEventsResponse>>
) => {
  const apiEndpoint = useBaseApiRoute("nft_collections");

  return useQuery({
    queryKey: [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_MUTATE_EVENTS,
      apiEndpoint,
      collectionAddress,
      limit,
      offset,
    ],
    queryFn: async () =>
      getNftCollectionMutateEventsByCollectionAddress(
        apiEndpoint,
        collectionAddress,
        limit,
        offset
      ),
    refetchOnWindowFocus: false,
    retry: 1,
    ...options,
  });
};

export const useNftCollectionsByAccountAddress = (accountAddress: Addr) => {
  const apiEndpoint = useBaseApiRoute("nft_collections");
  const {
    chainConfig: { indexer: indexerEndpoint },
  } = useCelatoneApp();
  const { tier } = useTierConfig();
  const formatAddress = useNftAddressFormat();

  return useQuery({
    queryKey: [
      CELATONE_QUERY_KEYS.NFT_COLLECTIONS_BY_ACCOUNT,
      apiEndpoint,
      indexerEndpoint,
      tier,
      accountAddress,
    ],
    queryFn: async () => {
      const formattedAccountAddress = formatAddress(accountAddress);
      return handleQueryByTier({
        queryFull: () =>
          getNftCollectionsByAccountAddress(
            apiEndpoint,
            formattedAccountAddress
          ),
        querySequencer: () =>
          getNftCollectionsByAccountAddressSequencer(
            indexerEndpoint,
            formattedAccountAddress
          ),
        threshold: "sequencer",
        tier,
      });
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
