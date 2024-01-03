import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { CELATONE_QUERY_KEYS, useCelatoneApp } from "lib/app-provider";
import {
  getCollectioUniqueHoldersCount,
  getCollectionActivitiesCount,
  getCollectionActivitiesPagination,
  getCollectionByCollectionAddress,
  getCollectionCreator,
  getCollectionListByAddress,
  getCollectionMutateEventsCount,
  getCollectionMutateEventsPagination,
  getCollectionTotalBurnedCount,
  getCollectionsPagination,
} from "lib/query";
import type { HexAddr } from "lib/types";

import type {
  ActivitiesCountResponse,
  CollectionCreator,
  CollectionCreatorResponse,
  CollectionInfo,
  CollectionInfoResponse,
  MutationEventsCountResponse,
  CollectionResponse,
  TotalBurnedCountResponse,
  UniqueHoldersCountResponse,
  ActivitiesResponse,
  Activity,
  Collection,
  CollectionMutateEventsResponse,
  CollectionMutateEvent,
  CollectionListByAddressResponse,
  CollectionByAddress,
} from "./collection";
import {
  zActivitiesCountResponseItem,
  zCollectionCreatorResponseItem,
  zCollectionInfoResponseItem,
  zCollectionResponseItem,
  zTotalBurnedResponseItem,
  zUniqueHoldersCountResponseItem,
  zActivitiesResponseItem,
  zMutationEventsCountResponseItem,
  zCollectionMutateEventsResponse,
  zCollectionListByAddressResponse,
} from "./collection";

export const useCollectionsPagination = (
  pageSize: number,
  offset: number,
  search?: string
) => {
  const { chainConfig } = useCelatoneApp();

  const queryFn = async () => {
    return axios
      .post<CollectionResponse>(chainConfig.indexer, {
        query: getCollectionsPagination,
        variables: { offset, pageSize, search },
      })
      .then(({ data: res }) =>
        zCollectionResponseItem.array().parse(res.data.collections)
      );
  };

  return useQuery<Collection[]>({
    queryKey: [
      CELATONE_QUERY_KEYS.NFT_COLLECTIONS_PAGINATION,
      chainConfig.indexer,
      pageSize,
      offset,
      search,
    ],
    queryFn,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useCollectionByCollectionAddress = (
  collectionAddress: HexAddr
) => {
  const { chainConfig } = useCelatoneApp();

  const queryFn = async () => {
    return axios
      .post<CollectionInfoResponse>(chainConfig.indexer, {
        query: getCollectionByCollectionAddress,
        variables: { vmAddress: collectionAddress },
      })
      .then(({ data: res }) =>
        zCollectionInfoResponseItem.parse(res.data.collections[0])
      );
  };

  return useQuery<CollectionInfo>({
    queryKey: [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_BY_ADDRESS,
      chainConfig.indexer,
      collectionAddress,
    ],
    queryFn,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useCollectionTotalBurnedCount = (collectionAddress: HexAddr) => {
  const { chainConfig } = useCelatoneApp();

  const queryFn = async () => {
    return axios
      .post<TotalBurnedCountResponse>(chainConfig.indexer, {
        query: getCollectionTotalBurnedCount,
        variables: { vmAddress: collectionAddress },
      })
      .then(({ data }) => zTotalBurnedResponseItem.parse(data.data));
  };

  return useQuery<number>({
    queryKey: [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_TOTAL_BURNED,
      chainConfig.indexer,
      collectionAddress,
    ],
    queryFn,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useCollectionCreator = (collectionAddress: HexAddr) => {
  const { chainConfig } = useCelatoneApp();

  const queryFn = async () => {
    return axios
      .post<CollectionCreatorResponse>(chainConfig.indexer, {
        query: getCollectionCreator,
        variables: { vmAddress: collectionAddress },
      })
      .then(({ data: res }) => zCollectionCreatorResponseItem.parse(res.data));
  };

  return useQuery<CollectionCreator>({
    queryKey: [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_CREATOR,
      chainConfig.indexer,
      collectionAddress,
    ],
    queryFn,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useCollectionActivitiesCount = (collectionAddress: HexAddr) => {
  const { chainConfig } = useCelatoneApp();

  const queryFn = async () => {
    return axios
      .post<ActivitiesCountResponse>(chainConfig.indexer, {
        query: getCollectionActivitiesCount,
        variables: { vmAddress: collectionAddress },
      })
      .then(({ data }) => zActivitiesCountResponseItem.parse(data.data));
  };

  return useQuery<number>({
    queryKey: [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_ACTIVITIES_COUNT,
      chainConfig.indexer,
      collectionAddress,
    ],
    queryFn,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useCollectionMutateEventsCount = (collectionAddress: HexAddr) => {
  const { chainConfig } = useCelatoneApp();

  const queryFn = async () => {
    return axios
      .post<MutationEventsCountResponse>(chainConfig.indexer, {
        query: getCollectionMutateEventsCount,
        variables: { vmAddress: collectionAddress },
      })
      .then(({ data }) => zMutationEventsCountResponseItem.parse(data.data));
  };

  return useQuery<number>({
    queryKey: [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_MUTATE_EVENTES_COUNT,
      chainConfig.indexer,
      collectionAddress,
    ],
    queryFn,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useCollectionUniqueHoldersCount = (collectionAddress: HexAddr) => {
  const { chainConfig } = useCelatoneApp();

  const queryFn = async () => {
    return axios
      .post<UniqueHoldersCountResponse>(chainConfig.indexer, {
        query: getCollectioUniqueHoldersCount,
        variables: { vmAddress: collectionAddress },
      })
      .then(({ data }) => zUniqueHoldersCountResponseItem.parse(data.data));
  };

  return useQuery<number>({
    queryKey: [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_UNIQUE_HOLDERS_COUNT,
      chainConfig.indexer,
      collectionAddress,
    ],
    queryFn,
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
  const queryFn = async () => {
    return axios
      .post<ActivitiesResponse>(chainConfig.indexer, {
        query: getCollectionActivitiesPagination,
        variables: {
          collectionAddress,
          pageSize,
          offset,
          search,
        },
      })
      .then(({ data: res }) =>
        zActivitiesResponseItem.array().parse(res.data.collection_transactions)
      );
  };

  return useQuery<Activity[]>({
    queryKey: [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_ACTIVITIES_PAGINATION,
      chainConfig.indexer,
      collectionAddress,
      offset,
      pageSize,
      search,
    ],
    queryFn,
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
  const queryFn = async () => {
    return axios
      .post<CollectionMutateEventsResponse>(chainConfig.indexer, {
        query: getCollectionMutateEventsPagination,
        variables: {
          collectionAddress,
          pageSize,
          offset,
        },
      })
      .then(({ data: res }) =>
        zCollectionMutateEventsResponse
          .array()
          .parse(res.data.collection_mutation_events)
      );
  };

  return useQuery<CollectionMutateEvent[]>({
    queryKey: [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_MUTATE_EVENTES_PAGINATION,
      chainConfig.indexer,
      collectionAddress,
      offset,
      pageSize,
    ],
    queryFn,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useCollectionListByAddress = (accountAddress: HexAddr) => {
  const { chainConfig } = useCelatoneApp();
  const queryFn = async () => {
    return axios
      .post<CollectionListByAddressResponse>(chainConfig.indexer, {
        query: getCollectionListByAddress,
        variables: { accountAddress },
      })
      .then(({ data: res }) =>
        zCollectionListByAddressResponse.array().parse(res.data.collections)
      );
  };

  return useQuery<CollectionByAddress[]>({
    queryKey: [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_LIST_BY_ADDRESS,
      chainConfig.indexer,
      accountAddress,
    ],
    queryFn,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
