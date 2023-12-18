import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { CELATONE_QUERY_KEYS, useCelatoneApp } from "lib/app-provider";
import {
  getCollectioUniqueHoldersCount,
  getCollectionActivities,
  getCollectionActivitiesCount,
  getCollectionByCollectionAddress,
  getCollectionCreator,
  getCollectionMutateEventsCount,
  getCollectionNFTSupllies,
  getCollectionTotalBurnedCount,
  getCollectionsPagination,
} from "lib/query";
import type {
  CollectionActivities,
  CollectionActivitiesCount,
  CollectionMutateEventsCount,
  CollectionUniqueHoldersCount,
  NFTCollection,
  NFTCollectionActivities,
  NFTCollectionCreator,
  NFTMetadata,
  NFTToken,
  NFTTotalBurn,
} from "lib/types";
import { snakeToCamel } from "lib/utils";

export const useCollectionsPagination = (
  pageSize: number,
  offset: number,
  search?: string
) => {
  const { chainConfig } = useCelatoneApp();

  const queryFn = async () => {
    const {
      data: { data },
    } = await axios.post(chainConfig.indexer, {
      query: getCollectionsPagination,
      variables: { offset, pageSize, search },
    });
    return snakeToCamel(data.collections);
  };

  return useQuery<NFTCollection[]>({
    queryKey: [
      CELATONE_QUERY_KEYS.NFT_COLLECTIONS,
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

export const useCollectionByCollectionAddress = (collectionAddress: string) => {
  const { chainConfig } = useCelatoneApp();

  const queryFn = async () => {
    const {
      data: { data },
    } = await axios.post(chainConfig.indexer, {
      query: getCollectionByCollectionAddress,
      variables: { vmAddress: collectionAddress },
    });
    return snakeToCamel(data.collections[0]);
  };

  return useQuery<NFTCollection>({
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

export const useMetadata = (uri: string) => {
  const queryFn = async () => {
    const { data } = await axios.get(uri);
    return snakeToCamel(data);
  };

  return useQuery<NFTMetadata>({
    queryKey: [CELATONE_QUERY_KEYS.NFT_METADATA, uri],
    queryFn,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useCollectionTotalBurnedCount = (collectionAddress: string) => {
  const { chainConfig } = useCelatoneApp();

  const queryFn = async () => {
    const {
      data: { data },
    } = await axios.post(chainConfig.indexer, {
      query: getCollectionTotalBurnedCount,
      variables: { vmAddress: collectionAddress },
    });
    return snakeToCamel(data);
  };

  return useQuery<NFTTotalBurn>({
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

export const useCollectionCreator = (collectionAddress: string) => {
  const { chainConfig } = useCelatoneApp();

  const queryFn = async () => {
    const {
      data: { data },
    } = await axios.post(chainConfig.indexer, {
      query: getCollectionCreator,
      variables: { vmAddress: collectionAddress },
    });
    return snakeToCamel(data.collections[0]);
  };

  return useQuery<NFTCollectionCreator>({
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

export const useCollectionActivitiesCount = (collectionAddress: string) => {
  const { chainConfig } = useCelatoneApp();

  const queryFn = async () => {
    const { count } = await axios
      .post<{ data: CollectionActivitiesCount }>(chainConfig.indexer, {
        query: getCollectionActivitiesCount,
        variables: { vmAddress: collectionAddress },
      })
      .then(
        ({ data }) => data.data.collection_transactions_aggregate.aggregate
      );

    return count;
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

export const useCollectionMutateEventsCount = (collectionAddress: string) => {
  const { chainConfig } = useCelatoneApp();

  const queryFn = async () => {
    const { count } = await axios
      .post<{ data: CollectionMutateEventsCount }>(chainConfig.indexer, {
        query: getCollectionMutateEventsCount,
        variables: { vmAddress: collectionAddress },
      })
      .then(
        ({ data }) => data.data.collection_mutation_events_aggregate.aggregate
      );
    return count;
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

export const useCollectionUniqueHoldersCount = (collectionAddress: string) => {
  const { chainConfig } = useCelatoneApp();

  const queryFn = async () => {
    const { count } = await axios
      .post<{ data: CollectionUniqueHoldersCount }>(chainConfig.indexer, {
        query: getCollectioUniqueHoldersCount,
        variables: { vmAddress: collectionAddress },
      })
      .then(({ data }) => data.data.nfts_aggregate.aggregate);
    return count;
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

export const useCollectionNFTSupllies = (
  collectionAddress: string,
  pageSize: number,
  offset: number,
  search?: string
) => {
  const { chainConfig } = useCelatoneApp();

  const queryFn = async () => {
    return axios
      .post<{ data: { nfts: NFTToken[] } }>(chainConfig.indexer, {
        query: getCollectionNFTSupllies,
        variables: {
          vmAddress: collectionAddress,
          pageSize,
          offset,
          search: `%${search}%`,
        },
      })
      .then(({ data }) => snakeToCamel(data.data.nfts));
  };

  return useQuery<NFTToken[]>({
    queryKey: [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_SUPPLIES,
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

export const useCollectionActivities = (
  collectionAddress: string,
  pageSize: number,
  offset: number,
  search?: string
) => {
  const { chainConfig } = useCelatoneApp();
  const queryFn = async () => {
    const data = await axios
      .post<{ data: CollectionActivities }>(chainConfig.indexer, {
        query: getCollectionActivities,
        variables: {
          vmAddress: collectionAddress,
          pageSize,
          offset,
        },
      })
      .then(({ data: res }) => res.data);
    return snakeToCamel(data);
  };

  return useQuery<NFTCollectionActivities>({
    queryKey: [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_ACTIVITIES,
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
