import { useQuery } from "@tanstack/react-query";

import { useCollectionActivitiesExpression } from "../expression";
import { CELATONE_QUERY_KEYS, useCelatoneApp } from "lib/app-provider";
import type { HexAddr } from "lib/types";

import type {
  CollectionCreator,
  CollectionInfo,
  Activity,
  Collection,
  CollectionMutateEvent,
  CollectionByAddress,
} from "./collection";
import {
  queryCollectionsPagination,
  queryCollectionInfo,
  queryTotalBurnedCount,
  queryCollectionCreator,
  queryCollectionActivitiesCount,
  queryCollectionMutateEventsCount,
  queryCollectionUniqueHoldersCount,
  queryCollectionActivities,
  queryCollectionMutateEventsPagination,
  queryCollectionListByAddress,
} from "./collection";

export const useCollectionsPagination = (
  pageSize: number,
  offset: number,
  search?: string
) => {
  const { chainConfig } = useCelatoneApp();
  return useQuery<Collection[]>({
    queryKey: [
      CELATONE_QUERY_KEYS.NFT_COLLECTIONS_PAGINATION,
      chainConfig.indexer,
      pageSize,
      offset,
      search,
    ],
    queryFn: () =>
      queryCollectionsPagination(chainConfig.indexer, offset, pageSize, search),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useCollectionByCollectionAddress = (
  collectionAddress: HexAddr
) => {
  const { chainConfig } = useCelatoneApp();
  return useQuery<CollectionInfo>({
    queryKey: [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_BY_ADDRESS,
      chainConfig.indexer,
      collectionAddress,
    ],
    queryFn: () => queryCollectionInfo(chainConfig.indexer, collectionAddress),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useCollectionTotalBurnedCount = (collectionAddress: HexAddr) => {
  const { chainConfig } = useCelatoneApp();
  return useQuery<number>({
    queryKey: [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_TOTAL_BURNED,
      chainConfig.indexer,
      collectionAddress,
    ],
    queryFn: () =>
      queryTotalBurnedCount(chainConfig.indexer, collectionAddress),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useCollectionCreator = (collectionAddress: HexAddr) => {
  const { chainConfig } = useCelatoneApp();
  return useQuery<CollectionCreator>({
    queryKey: [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_CREATOR,
      chainConfig.indexer,
      collectionAddress,
    ],
    queryFn: () =>
      queryCollectionCreator(chainConfig.indexer, collectionAddress),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useCollectionActivitiesCount = (collectionAddress: HexAddr) => {
  const { chainConfig } = useCelatoneApp();
  return useQuery<number>({
    queryKey: [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_ACTIVITIES_COUNT,
      chainConfig.indexer,
      collectionAddress,
    ],
    queryFn: () =>
      queryCollectionActivitiesCount(chainConfig.indexer, collectionAddress),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useCollectionMutateEventsCount = (collectionAddress: HexAddr) => {
  const { chainConfig } = useCelatoneApp();
  return useQuery<number>({
    queryKey: [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_MUTATE_EVENTES_COUNT,
      chainConfig.indexer,
      collectionAddress,
    ],
    queryFn: () =>
      queryCollectionMutateEventsCount(chainConfig.indexer, collectionAddress),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useCollectionUniqueHoldersCount = (collectionAddress: HexAddr) => {
  const { chainConfig } = useCelatoneApp();
  return useQuery<number>({
    queryKey: [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_UNIQUE_HOLDERS_COUNT,
      chainConfig.indexer,
      collectionAddress,
    ],
    queryFn: () =>
      queryCollectionUniqueHoldersCount(chainConfig.indexer, collectionAddress),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useCollectionActivities = (
  collectionAddress: HexAddr,
  pageSize: number,
  offset: number,
  search?: string
) => {
  const { chainConfig } = useCelatoneApp();
  const expression = useCollectionActivitiesExpression(
    collectionAddress,
    search
  );
  return useQuery<Activity[]>({
    queryKey: [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_ACTIVITIES_PAGINATION,
      chainConfig.indexer,
      collectionAddress,
      offset,
      pageSize,
      expression,
    ],
    queryFn: () =>
      queryCollectionActivities(
        chainConfig.indexer,
        pageSize,
        offset,
        expression
      ),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useCollectionMutateEventsPagination = (
  collectionAddress: HexAddr,
  pageSize: number,
  offset: number
) => {
  const { chainConfig } = useCelatoneApp();
  return useQuery<CollectionMutateEvent[]>({
    queryKey: [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_MUTATE_EVENTES_PAGINATION,
      chainConfig.indexer,
      collectionAddress,
      offset,
      pageSize,
    ],
    queryFn: () =>
      queryCollectionMutateEventsPagination(
        chainConfig.indexer,
        collectionAddress,
        pageSize,
        offset
      ),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useCollectionListByAddress = (accountAddress: HexAddr) => {
  const { chainConfig } = useCelatoneApp();
  return useQuery<CollectionByAddress[]>({
    queryKey: [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_LIST_BY_ADDRESS,
      chainConfig.indexer,
      accountAddress,
    ],
    queryFn: () =>
      queryCollectionListByAddress(chainConfig.indexer, accountAddress),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
