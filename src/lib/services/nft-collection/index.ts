import { useQuery } from "@tanstack/react-query";
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
import { getCollectionsByAccountSequencer } from "./sequencer";

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
      chainConfig.indexer,
      limit,
      offset,
      search,
    ],
    async () => getCollections(chainConfig.indexer, limit, offset, search),
    {
      retry: 1,
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};

export const useCollectionByCollectionAddress = (
  collectionAddress: HexAddr32
) => {
  const { chainConfig } = useCelatoneApp();
  return useQuery<CollectionByCollectionAddressResponse>(
    [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_BY_COLLECTION_ADDRESS,
      chainConfig.indexer,
      collectionAddress,
    ],
    async () =>
      getCollectionByCollectionAddress(chainConfig.indexer, collectionAddress),
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export const useCollectionCreator = (collectionAddress: HexAddr32) => {
  const { chainConfig } = useCelatoneApp();
  return useQuery<CollectionCreatorResponse>(
    [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_CREATOR,
      chainConfig.indexer,
      collectionAddress,
    ],
    async () => getCollectionCreator(chainConfig.indexer, collectionAddress),
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
      chainConfig.indexer,
      collectionAddress,
      limit,
      offset,
      search,
    ],
    async () =>
      getCollectionActivities(
        chainConfig.indexer,
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

export const useCollectionActivitiesCount = (collectionAddress: HexAddr32) => {
  const { chainConfig } = useCelatoneApp();
  return useQuery<number>(
    [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_ACTIVITIES_COUNT,
      chainConfig.indexer,
      collectionAddress,
    ],
    async () =>
      getCollectionActivitiesCount(chainConfig.indexer, collectionAddress),
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
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
      chainConfig.indexer,
      collectionAddress,
      limit,
      offset,
    ],
    async () =>
      getCollectionMutateEvents(
        chainConfig.indexer,
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
  collectionAddress: HexAddr32
) => {
  const { chainConfig } = useCelatoneApp();
  return useQuery<number>(
    [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_MUTATE_EVENTS_COUNT,
      chainConfig.indexer,
      collectionAddress,
    ],
    async () =>
      getCollectionMutateEventsCount(chainConfig.indexer, collectionAddress),
    {
      retry: 1,
      refetchOnWindowFocus: false,
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
      chainConfig.indexer,
      collectionAddress,
    ],
    async () =>
      getCollectionUniqueHoldersCount(chainConfig.indexer, collectionAddress),
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
      chainConfig.indexer,
      accountAddress,
    ],
    async () =>
      handleQueryByTier({
        tier,
        threshold: "sequencer",
        querySequencer: () =>
          getCollectionsByAccountSequencer(lcdEndpoint, accountAddress),
        queryFull: () =>
          getCollectionsByAccount(chainConfig.indexer, accountAddress),
      }),
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};
