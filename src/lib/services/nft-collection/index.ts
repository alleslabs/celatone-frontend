import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";

import {
  CELATONE_QUERY_KEYS,
  useBaseApiRoute,
  useCelatoneApp,
  useCurrentChain,
  useTierConfig,
} from "lib/app-provider";
import type { HexAddr, HexAddr32 } from "lib/types";

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
import type {
  ActivitiesResponse,
  CollectionCreatorResponse,
  CollectionMutateEventsResponse,
  NftCollectionsResponse,
} from "../types";
import { handleQueryByTier } from "../utils";

export const useNftCollections = (
  limit: number,
  offset: number,
  search?: string,
  options?: Pick<
    UseQueryOptions<NftCollectionsResponse>,
    "onSuccess" | "enabled"
  >
) => {
  const apiEndpoint = useBaseApiRoute("nft_collections");

  return useQuery(
    [CELATONE_QUERY_KEYS.NFT_COLLECTIONS, apiEndpoint, limit, offset, search],
    async () => getNftCollections(apiEndpoint, limit, offset, search),
    {
      retry: 1,
      refetchOnWindowFocus: false,
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
    chainConfig: { lcd: lcdEndpoint },
  } = useCelatoneApp();

  return useQuery(
    [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_BY_COLLECTION_ADDRESS,
      apiEndpoint,
      lcdEndpoint,
      tier,
      collectionAddress,
    ],
    async () =>
      handleQueryByTier({
        tier,
        threshold: "sequencer",
        queryFull: () =>
          getNftCollectionByCollectionAddress(apiEndpoint, collectionAddress),
        querySequencer: () =>
          getNftCollectionByCollectionAddressSequencer(
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

export const useNftCollectionCreator = (collectionAddress: HexAddr32) => {
  const { bech32Prefix } = useCurrentChain();
  const { tier } = useTierConfig();
  const apiEndpoint = useBaseApiRoute("nft_collections");
  const {
    chainConfig: { lcd: lcdEndpoint },
  } = useCelatoneApp();

  return useQuery<CollectionCreatorResponse>(
    [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_CREATOR,
      apiEndpoint,
      lcdEndpoint,
      tier,
      bech32Prefix,
      collectionAddress,
    ],
    async () =>
      handleQueryByTier({
        tier,
        threshold: "sequencer",
        queryFull: () =>
          getNftCollectionCreatorByCollectionAddress(
            apiEndpoint,
            collectionAddress
          ),
        querySequencer: () =>
          getNftCollectionCreatorSequencer(
            lcdEndpoint,
            bech32Prefix,
            collectionAddress
          ),
      }),
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export const useNftCollectionActivities = (
  collectionAddress: HexAddr32,
  limit: number,
  offset: number,
  search = "",
  options?: Pick<UseQueryOptions<ActivitiesResponse>, "onSuccess" | "enabled">
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
      retry: 1,
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};

export const useNftCollectionActivitiesSequencer = (
  collectionAddress: HexAddr32
) => {
  const {
    chainConfig: { lcd: lcdEndpoint },
  } = useCelatoneApp();

  const { data, ...rest } = useInfiniteQuery(
    [CELATONE_QUERY_KEYS.NFT_COLLECTION_ACTIVITIES_SEQUENCER, lcdEndpoint],
    async ({ pageParam }) =>
      getNftCollectionActivitiesSequencer(
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

export const useNftCollectionMutateEvents = (
  collectionAddress: HexAddr32,
  limit: number,
  offset: number,
  options?: Pick<
    UseQueryOptions<CollectionMutateEventsResponse>,
    "onSuccess" | "enabled"
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
      retry: 1,
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};

export const useNftCollectionsByAccountAddress = (accountAddress: HexAddr) => {
  const apiEndpoint = useBaseApiRoute("nft_collections");
  const {
    chainConfig: { lcd: lcdEndpoint },
  } = useCelatoneApp();
  const { tier } = useTierConfig();

  return useQuery(
    [
      CELATONE_QUERY_KEYS.NFT_COLLECTIONS_BY_ACCOUNT,
      apiEndpoint,
      lcdEndpoint,
      tier,
      accountAddress,
    ],
    async () =>
      handleQueryByTier({
        tier,
        threshold: "sequencer",
        queryFull: () =>
          getNftCollectionsByAccountAddress(apiEndpoint, accountAddress),
        querySequencer: () =>
          getNftCollectionsByAccountAddressSequencer(
            lcdEndpoint,
            accountAddress
          ),
      }),
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};
