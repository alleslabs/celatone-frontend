import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";

import type {
  Activity,
  CollectionByCollectionAddressResponse,
  CollectionCreatorResponse,
  CollectionsByAccountResponse,
  CollectionsResponse,
} from "../types";
import { handleQueryByTier } from "../utils";
import {
  CELATONE_QUERY_KEYS,
  useCelatoneApp,
  useCurrentChain,
  useLcdEndpoint,
  useTierConfig,
} from "lib/app-provider";
import type { HexAddr, HexAddr32, MutateEvent } from "lib/types";

import {
  getCollectionActivities,
  getCollectionActivitiesCount,
  getCollectionByCollectionAddress,
  getCollectionCreator,
  getCollectionMutateEvents,
  getCollectionMutateEventsCount,
  getCollections,
  getCollectionsByAccount,
  getCollectionUniqueHoldersCount,
} from "./gql";
import {
  getCollectionActivitiesSequencer,
  getCollectionByCollectionAddressSequencer,
  getCollectionCreatorSequencer,
  getCollectionsByAccountSequencer,
} from "./sequencer";

export const useCollections = (
  limit: number,
  offset: number,
  search?: string,
  options?: Pick<UseQueryOptions<CollectionsResponse>, "onSuccess">
) => {
  const { chainConfig } = useCelatoneApp();
  return useQuery<CollectionsResponse>(
    [
      CELATONE_QUERY_KEYS.NFT_COLLECTIONS,
      chainConfig.graphql,
      limit,
      offset,
      search,
    ],
    async () =>
      getCollections(chainConfig.graphql ?? "", limit, offset, search),
    {
      retry: 1,
      refetchOnWindowFocus: false,
      enabled: !!chainConfig.graphql,
      ...options,
    }
  );
};

export const useCollectionByCollectionAddress = (
  collectionAddress: HexAddr32,
  enabled = true
) => {
  const { chainConfig } = useCelatoneApp();
  const { tier } = useTierConfig();
  const lcdEndpoint = useLcdEndpoint();

  return useQuery<CollectionByCollectionAddressResponse>(
    [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_BY_COLLECTION_ADDRESS,
      chainConfig.graphql,
      lcdEndpoint,
      tier,
      collectionAddress,
    ],
    async () =>
      handleQueryByTier({
        tier,
        threshold: "sequencer",
        queryFull: () =>
          getCollectionByCollectionAddress(
            chainConfig.graphql ?? "",
            collectionAddress
          ),
        querySequencer: () =>
          getCollectionByCollectionAddressSequencer(
            lcdEndpoint,
            collectionAddress
          ),
      }),
    {
      retry: 1,
      refetchOnWindowFocus: false,
      enabled,
    }
  );
};

export const useCollectionCreator = (collectionAddress: HexAddr32) => {
  const { chainConfig } = useCelatoneApp();
  const {
    chain: { bech32_prefix: prefix },
  } = useCurrentChain();
  const { tier } = useTierConfig();
  const lcdEndpoint = useLcdEndpoint();

  return useQuery<CollectionCreatorResponse>(
    [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_CREATOR,
      chainConfig.graphql,
      collectionAddress,
    ],
    async () =>
      handleQueryByTier({
        tier,
        threshold: "sequencer",
        queryFull: () =>
          getCollectionCreator(chainConfig.graphql ?? "", collectionAddress),
        querySequencer: () =>
          getCollectionCreatorSequencer(lcdEndpoint, prefix, collectionAddress),
      }),
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export const useCollectionActivities = (
  collectionAddress: HexAddr32,
  limit: number,
  offset: number,
  search?: string
) => {
  const { chainConfig } = useCelatoneApp();
  return useQuery<Activity[]>(
    [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_ACTIVITIES,
      chainConfig.graphql,
      collectionAddress,
      limit,
      offset,
      search,
    ],
    async () =>
      getCollectionActivities(
        chainConfig.graphql ?? "",
        collectionAddress,
        limit,
        offset,
        search
      ),
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export const useCollectionActivitiesCount = (
  collectionAddress: HexAddr32,
  enabled = true
) => {
  const { chainConfig } = useCelatoneApp();
  return useQuery<number>(
    [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_ACTIVITIES_COUNT,
      chainConfig.graphql,
      collectionAddress,
    ],
    async () =>
      getCollectionActivitiesCount(
        chainConfig.graphql ?? "",
        collectionAddress
      ),
    {
      retry: 1,
      refetchOnWindowFocus: false,
      enabled,
    }
  );
};

export const useCollectionActivitiesSequencer = (
  collectionAddress: HexAddr32
) => {
  const lcdEndpoint = useLcdEndpoint();

  const { data, ...rest } = useInfiniteQuery(
    [CELATONE_QUERY_KEYS.NFT_COLLECTION_ACTIVITIES_SEQUENCER, lcdEndpoint],
    async ({ pageParam }) =>
      getCollectionActivitiesSequencer(
        lcdEndpoint,
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

export const useCollectionMutateEvents = (
  collectionAddress: HexAddr32,
  limit: number,
  offset: number
) => {
  const { chainConfig } = useCelatoneApp();
  return useQuery<MutateEvent[]>(
    [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_MUTATE_EVENTS,
      chainConfig.graphql,
      collectionAddress,
      limit,
      offset,
    ],
    async () =>
      getCollectionMutateEvents(
        chainConfig.graphql ?? "",
        collectionAddress,
        limit,
        offset
      ),
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export const useCollectionMutateEventsCount = (
  collectionAddress: HexAddr32,
  enabled = true
) => {
  const { chainConfig } = useCelatoneApp();
  return useQuery<number>(
    [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_MUTATE_EVENTS_COUNT,
      chainConfig.graphql,
      collectionAddress,
    ],
    async () =>
      getCollectionMutateEventsCount(
        chainConfig.graphql ?? "",
        collectionAddress
      ),
    {
      retry: 1,
      refetchOnWindowFocus: false,
      enabled,
    }
  );
};

export const useCollectionUniqueHoldersCount = (
  collectionAddress: HexAddr32
) => {
  const { chainConfig } = useCelatoneApp();
  return useQuery<number>(
    [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_UNIQUE_HOLDERS_COUNT,
      chainConfig.graphql,
      collectionAddress,
    ],
    async () =>
      getCollectionUniqueHoldersCount(
        chainConfig.graphql ?? "",
        collectionAddress
      ),
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export const useCollectionsByAccount = (accountAddress: HexAddr) => {
  const { chainConfig } = useCelatoneApp();
  const lcdEndpoint = useLcdEndpoint();
  const { tier } = useTierConfig();

  return useQuery<CollectionsByAccountResponse[]>(
    [
      CELATONE_QUERY_KEYS.NFT_COLLECTIONS_BY_ACCOUNT,
      chainConfig.graphql,
      lcdEndpoint,
      tier,
      accountAddress,
    ],
    async () =>
      handleQueryByTier({
        tier,
        threshold: "sequencer",
        querySequencer: () =>
          getCollectionsByAccountSequencer(lcdEndpoint, accountAddress),
        queryFull: () =>
          getCollectionsByAccount(chainConfig.graphql ?? "", accountAddress),
      }),
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};
