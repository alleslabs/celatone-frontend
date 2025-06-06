import type { UseQueryOptions } from "@tanstack/react-query";
import type { BechAddr32, HexAddr, HexAddr32, Nullable } from "lib/types";

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
import { useFormatAddresses } from "lib/hooks/useFormatAddresses";

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
  options?: Pick<
    UseQueryOptions<NftCollectionsResponse>,
    "enabled" | "onSuccess"
  >
) => {
  const apiEndpoint = useBaseApiRoute("nft_collections");

  return useQuery(
    [CELATONE_QUERY_KEYS.NFT_COLLECTIONS, apiEndpoint, limit, offset, search],
    () => getNftCollections(apiEndpoint, limit, offset, search),
    {
      refetchOnWindowFocus: false,
      retry: 1,
      ...options,
    }
  );
};

export const useNftCollectionsSequencer = (limit: number, search?: string) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();
  const formatAddresses = useFormatAddresses();
  const { isSomeValidAddress } = useValidateAddress();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery(
      [
        CELATONE_QUERY_KEYS.NFT_COLLECTIONS_SEQUENCER,
        restEndpoint,
        limit,
        search ?? "",
      ],
      ({ pageParam }) => {
        if (search) {
          if (isSomeValidAddress(search)) {
            const formattedAddress = formatAddresses(search);
            return getNftCollectionsByCollectionAddressSequencer(
              restEndpoint,
              formattedAddress.address as BechAddr32
            );
          }

          return getNftCollecitonsByNameSequencer(
            restEndpoint,
            search,
            pageParam
          );
        }

        return getNftCollectionsSequencer(restEndpoint, limit, pageParam);
      },
      {
        getNextPageParam: (lastPage) =>
          lastPage.pagination.nextKey ?? undefined,
        refetchOnWindowFocus: false,
      }
    );

  return {
    data: data?.pages.flatMap((page) => page.collections),
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  };
};

export const useNftCollectionByCollectionAddress = (
  collectionAddressBech: BechAddr32,
  collectionAddressHex: HexAddr32,
  enabled = true
) => {
  const { tier } = useTierConfig();
  const { enabled: isMove } = useMoveConfig({ shouldRedirect: false });
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
      collectionAddressBech,
      collectionAddressHex,
    ],
    () =>
      handleQueryByTier<Nullable<CollectionByCollectionAddressResponse>>({
        queryFull: () =>
          getNftCollectionByCollectionAddress(
            apiEndpoint,
            collectionAddressHex
          ),
        querySequencer: () =>
          getNftCollectionByCollectionAddressSequencer(
            restEndpoint,
            collectionAddressBech,
            collectionAddressHex,
            isMove
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

export const useNftCollectionInfosWasm = (collectionAddress: BechAddr32) => {
  const { enabled } = useWasmConfig({ shouldRedirect: false });
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();

  return useQuery(
    [
      CELATONE_QUERY_KEYS.NFT_COLLECTION_INFOS_BY_COLLECTION_ADDRESS_WASM,
      collectionAddress,
    ],
    () =>
      getCollectionByCollectionAddressWasmRest(restEndpoint, collectionAddress),
    {
      enabled,
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
};

export const useNftCollectionCreator = (
  collectionAddressBech: BechAddr32,
  collectionAddressHex: HexAddr32
) => {
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
      collectionAddressHex,
      collectionAddressBech,
    ],
    async () =>
      handleQueryByTier<CollectionCreatorResponse>({
        queryFull: () =>
          getNftCollectionCreatorByCollectionAddress(
            apiEndpoint,
            collectionAddressHex
          ),
        querySequencer: () =>
          getNftCollectionCreatorByCollectionAddressSequencer(
            restEndpoint,
            bech32Prefix,
            collectionAddressBech
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

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery(
      [CELATONE_QUERY_KEYS.NFT_COLLECTION_ACTIVITIES_SEQUENCER, restEndpoint],
      async ({ pageParam }) =>
        getNftCollectionActivitiesSequencer(
          restEndpoint,
          pageParam,
          collectionAddress
        ),
      {
        getNextPageParam: (lastPage) =>
          lastPage.pagination.nextKey ?? undefined,
        refetchOnWindowFocus: false,
      }
    );

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
        // TODO: revisit this later, it isn't used now.
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
