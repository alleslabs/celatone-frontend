import type { UseQueryOptions } from "@tanstack/react-query";
import type { HexAddr, HexAddr32 } from "lib/types";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCelatoneApp,
  useCurrentChain,
  useTierConfig,
} from "lib/app-provider";

import type {
  ActivitiesResponse,
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
import {
  getNftCollectionActivitiesSequencer,
  getNftCollectionByCollectionAddressSequencer,
  getNftCollectionCreatorSequencer,
  getNftCollectionsByAccountAddressSequencer,
} from "./sequencer";

export const useNftCollections = (
  limit: number,
  offset: number,
  search?: string,
  options?: Pick<
    UseQueryOptions<NftCollectionsResponse>,
    "enabled" | "onSuccess"
  >
) => {
  const apiEndpoint = useBaseApiRoute("nft_collections");

  return useQuery(
    [CELATONE_QUERY_KEYS.NFT_COLLECTIONS, apiEndpoint, limit, offset, search],
    async () => getNftCollections(apiEndpoint, limit, offset, search),
    {
      refetchOnWindowFocus: false,
      retry: 1,
      ...options,
    }
  );
};

export const useNftCollectionByCollectionAddress = (
  collectionAddress: HexAddr32,
  enabled = true
) => {
  const { tier } = useTierConfig();
  const apiEndpoint = useBaseApiRoute("nft_collections");
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  return useQuery(
    [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_BY_COLLECTION_ADDRESS,
      apiEndpoint,
      restEndpoint,
      tier,
      collectionAddress,
    ],
    async () =>
      handleQueryByTier({
        queryFull: () =>
          getNftCollectionByCollectionAddress(apiEndpoint, collectionAddress),
        querySequencer: () =>
          getNftCollectionByCollectionAddressSequencer(
            restEndpoint,
            collectionAddress
          ),
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

export const useNftCollectionCreator = (collectionAddress: HexAddr32) => {
  const { bech32Prefix } = useCurrentChain();
  const { tier } = useTierConfig();
  const apiEndpoint = useBaseApiRoute("nft_collections");
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  return useQuery<CollectionCreatorResponse>(
    [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_CREATOR,
      apiEndpoint,
      restEndpoint,
      tier,
      bech32Prefix,
      collectionAddress,
    ],
    async () =>
      handleQueryByTier({
        queryFull: () =>
          getNftCollectionCreatorByCollectionAddress(
            apiEndpoint,
            collectionAddress
          ),
        querySequencer: () =>
          getNftCollectionCreatorSequencer(
            restEndpoint,
            bech32Prefix,
            collectionAddress
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

export const useNftCollectionActivities = (
  collectionAddress: HexAddr32,
  limit: number,
  offset: number,
  search = "",
  options?: Pick<UseQueryOptions<ActivitiesResponse>, "enabled" | "onSuccess">
) => {
  const apiEndpoint = useBaseApiRoute("nft_collections");

  return useQuery(
    [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_ACTIVITIES,
      apiEndpoint,
      collectionAddress,
      limit,
      offset,
      search,
    ],
    async () =>
      getNftCollectionActivitiesByCollectionAddress(
        apiEndpoint,
        collectionAddress,
        limit,
        offset,
        search
      ),
    {
      refetchOnWindowFocus: false,
      retry: 1,
      ...options,
    }
  );
};

export const useNftCollectionActivitiesSequencer = (
  collectionAddress: HexAddr32
) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  const { data, ...rest } = useInfiniteQuery(
    [CELATONE_QUERY_KEYS.NFT_COLLECTION_ACTIVITIES_SEQUENCER, restEndpoint],
    async ({ pageParam }) =>
      getNftCollectionActivitiesSequencer(
        restEndpoint,
        pageParam,
        collectionAddress
      ),
    {
      getNextPageParam: (lastPage) => lastPage.pagination.nextKey ?? undefined,
      refetchOnWindowFocus: false,
    }
  );

  return {
    data: data?.pages.flatMap((page) => page.items),
    ...rest,
  };
};

export const useNftCollectionMutateEvents = (
  collectionAddress: HexAddr32,
  limit: number,
  offset: number,
  options?: Pick<
    UseQueryOptions<CollectionMutateEventsResponse>,
    "enabled" | "onSuccess"
  >
) => {
  const apiEndpoint = useBaseApiRoute("nft_collections");

  return useQuery(
    [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_MUTATE_EVENTS,
      apiEndpoint,
      collectionAddress,
      limit,
      offset,
    ],
    async () =>
      getNftCollectionMutateEventsByCollectionAddress(
        apiEndpoint,
        collectionAddress,
        limit,
        offset
      ),
    {
      refetchOnWindowFocus: false,
      retry: 1,
      ...options,
    }
  );
};

export const useNftCollectionsByAccountAddress = (accountAddress: HexAddr) => {
  const apiEndpoint = useBaseApiRoute("nft_collections");
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();
  const { tier } = useTierConfig();

  return useQuery(
    [
      CELATONE_QUERY_KEYS.NFT_COLLECTIONS_BY_ACCOUNT,
      apiEndpoint,
      restEndpoint,
      tier,
      accountAddress,
    ],
    async () =>
      handleQueryByTier({
        queryFull: () =>
          getNftCollectionsByAccountAddress(apiEndpoint, accountAddress),
        querySequencer: () =>
          getNftCollectionsByAccountAddressSequencer(
            restEndpoint,
            accountAddress
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
