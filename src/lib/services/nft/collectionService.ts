import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import {
  useCollectionActivitiesExpression,
  useCollectionActivitiesExpressionOld,
  useCollectionsExpression,
  useCollectionsExpressionOld,
} from "../expression";
import {
  CELATONE_QUERY_KEYS,
  useCelatoneApp,
  useCurrentChain,
} from "lib/app-provider";
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
import {
  getCollectionActivitiesCountOld,
  getCollectionActivitiesOld,
  getCollectionByCollectionAddressOld,
  getCollectionCreatorOld,
  getCollectionMutateEventsCountOld,
  getCollectionMutateEventsOld,
  getCollectionsByAccountOld,
  getCollectionsOld,
  getCollectionUniqueHoldersCountOld,
} from "./collectionOld";

const INITIATION_CHAIN_ID = "initiation-1";

export const useCollections = (
  pageSize: number,
  offset: number,
  search?: string,
  options?: Pick<UseQueryOptions<CollectionsResponse>, "onSuccess">
) => {
  const { chainConfig } = useCelatoneApp();
  const {
    chain: { chain_id: chainId },
  } = useCurrentChain();
  const expressionNew = useCollectionsExpression(search);
  const expressionOld = useCollectionsExpressionOld(search);
  const expression =
    chainId === INITIATION_CHAIN_ID ? expressionNew : expressionOld;

  return useQuery<CollectionsResponse>(
    [
      CELATONE_QUERY_KEYS.NFT_COLLECTIONS,
      chainConfig.indexer,
      pageSize,
      offset,
      expression,
    ],
    async () =>
      chainId === INITIATION_CHAIN_ID
        ? getCollections(chainConfig.indexer, offset, pageSize, expression)
        : getCollectionsOld(chainConfig.indexer, offset, pageSize, expression),
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
  const {
    chain: { chain_id: chainId },
  } = useCurrentChain();
  return useQuery<CollectionByCollectionAddressResponse>(
    [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_BY_COLLECTION_ADDRESS,
      chainConfig.indexer,
      collectionAddress,
    ],
    async () =>
      chainId === INITIATION_CHAIN_ID
        ? getCollectionByCollectionAddress(
            chainConfig.indexer,
            collectionAddress
          )
        : getCollectionByCollectionAddressOld(
            chainConfig.indexer,
            collectionAddress
          ),
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export const useCollectionCreator = (collectionAddress: HexAddr32) => {
  const { chainConfig } = useCelatoneApp();
  const {
    chain: { chain_id: chainId },
  } = useCurrentChain();
  return useQuery<CollectionCreatorResponse>(
    [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_CREATOR,
      chainConfig.indexer,
      collectionAddress,
    ],
    async () =>
      chainId === INITIATION_CHAIN_ID
        ? getCollectionCreator(chainConfig.indexer, collectionAddress)
        : getCollectionCreatorOld(chainConfig.indexer, collectionAddress),
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
  const {
    chain: { chain_id: chainId },
  } = useCurrentChain();
  const expressionNew = useCollectionActivitiesExpression(
    collectionAddress,
    search
  );
  const expressionOld = useCollectionActivitiesExpressionOld(
    collectionAddress,
    search
  );
  const expression =
    chainId === INITIATION_CHAIN_ID ? expressionNew : expressionOld;

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
      chainId === INITIATION_CHAIN_ID
        ? getCollectionActivities(
            chainConfig.indexer,
            pageSize,
            offset,
            expression
          )
        : getCollectionActivitiesOld(
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
  const {
    chain: { chain_id: chainId },
  } = useCurrentChain();
  return useQuery<number>(
    [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_ACTIVITIES_COUNT,
      chainConfig.indexer,
      collectionAddress,
    ],
    async () =>
      chainId === INITIATION_CHAIN_ID
        ? getCollectionActivitiesCount(chainConfig.indexer, collectionAddress)
        : getCollectionActivitiesCountOld(
            chainConfig.indexer,
            collectionAddress
          ),
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
  const {
    chain: { chain_id: chainId },
  } = useCurrentChain();
  return useQuery<MutateEvent[]>(
    [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_MUTATE_EVENTS,
      chainConfig.indexer,
      collectionAddress,
      offset,
      pageSize,
    ],
    async () =>
      chainId === INITIATION_CHAIN_ID
        ? getCollectionMutateEvents(
            chainConfig.indexer,
            collectionAddress,
            pageSize,
            offset
          )
        : getCollectionMutateEventsOld(
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
  const {
    chain: { chain_id: chainId },
  } = useCurrentChain();
  return useQuery<number>(
    [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_MUTATE_EVENTS_COUNT,
      chainConfig.indexer,
      collectionAddress,
    ],
    async () =>
      chainId === INITIATION_CHAIN_ID
        ? getCollectionMutateEventsCount(chainConfig.indexer, collectionAddress)
        : getCollectionMutateEventsCountOld(
            chainConfig.indexer,
            collectionAddress
          ),
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
  const {
    chain: { chain_id: chainId },
  } = useCurrentChain();
  return useQuery<number>(
    [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_UNIQUE_HOLDERS_COUNT,
      chainConfig.indexer,
      collectionAddress,
    ],
    async () =>
      chainId === INITIATION_CHAIN_ID
        ? getCollectionUniqueHoldersCount(
            chainConfig.indexer,
            collectionAddress
          )
        : getCollectionUniqueHoldersCountOld(
            chainConfig.indexer,
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
  const {
    chain: { chain_id: chainId },
  } = useCurrentChain();
  return useQuery<CollectionsByAccountResponse>(
    [
      CELATONE_QUERY_KEYS.NFT_COLLECTIONS_BY_ACCOUNT,
      chainConfig.indexer,
      accountAddress,
    ],
    async () =>
      chainId === INITIATION_CHAIN_ID
        ? getCollectionsByAccount(chainConfig.indexer, accountAddress)
        : getCollectionsByAccountOld(chainConfig.indexer, accountAddress),
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};
