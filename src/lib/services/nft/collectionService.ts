import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import {
  useCollectionActivitiesExpression,
  useCollectionsExpression,
} from "../expression";
import { CELATONE_QUERY_KEYS, useCelatoneApp } from "lib/app-provider";
import type { HexAddr, HexAddr32, MutateEvent } from "lib/types";

import type {
  Activity,
  CollectionByCollectionAddressResponse,
  CollectionCreatorResponse,
  CollectionsByAccountResponse,
  CollectionsResponse,
} from "./collection";
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
} from "./collection";

export const useCollections = (
  pageSize: number,
  offset: number,
  search?: string,
  options?: Pick<UseQueryOptions<CollectionsResponse>, "onSuccess">
) => {
  const { chainConfig } = useCelatoneApp();
  const expression = useCollectionsExpression(search);

  return useQuery<CollectionsResponse>(
    [
      CELATONE_QUERY_KEYS.NFT_COLLECTIONS,
      chainConfig.indexer,
      pageSize,
      offset,
      expression,
    ],
    async () =>
      getCollections(chainConfig.indexer, offset, pageSize, expression),
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
  pageSize: number,
  offset: number,
  search?: string
) => {
  const { chainConfig } = useCelatoneApp();
  const expression = useCollectionActivitiesExpression(
    collectionAddress,
    search
  );
  return useQuery<Activity[]>(
    [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_ACTIVITIES,
      chainConfig.indexer,
      collectionAddress,
      offset,
      pageSize,
      expression,
    ],
    async () =>
      getCollectionActivities(
        chainConfig.indexer,
        pageSize,
        offset,
        expression
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
  pageSize: number,
  offset: number
) => {
  const { chainConfig } = useCelatoneApp();
  return useQuery<MutateEvent[]>(
    [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_MUTATE_EVENTS,
      chainConfig.indexer,
      collectionAddress,
      offset,
      pageSize,
    ],
    async () =>
      getCollectionMutateEvents(
        chainConfig.indexer,
        collectionAddress,
        pageSize,
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
  return useQuery<CollectionsByAccountResponse>(
    [
      CELATONE_QUERY_KEYS.NFT_COLLECTIONS_BY_ACCOUNT,
      chainConfig.indexer,
      accountAddress,
    ],
    async () => getCollectionsByAccount(chainConfig.indexer, accountAddress),
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};
